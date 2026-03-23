"""
Polymarket CLOB exchange implementation.
"""
import asyncio
import functools
import json
import logging
import time

import httpx
import websockets
from eth_account import Account
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import (
    AssetType,
    BalanceAllowanceParams,
    OrderArgs,
    OrderType as PolyOrderType,
)
from py_clob_client.http_helpers import helpers as http_helpers
from py_clob_client.order_builder.constants import BUY, SELL

from .base import (
    ExchangeBase,
    MarketMetadata,
    OrderBookLevel,
    OrderBookSnapshot,
    OrderResponse,
    OrderType,
    Position,
    Side,
)

logger = logging.getLogger(__name__)

CLOB_HOST = "https://clob.polymarket.com"
GAMMA_HOST = "https://gamma-api.polymarket.com"
DATA_API_HOST = "https://data-api.polymarket.com"
WS_MARKET_URL = "wss://ws-subscriptions-clob.polymarket.com/ws/market"
WS_USER_URL = "wss://ws-subscriptions-clob.polymarket.com/ws/user"
CHAIN_ID = 137


class PolymarketExchange(ExchangeBase):
    def __init__(self, private_key: str, funder: str | None = None, signature_type: int = 0):
        self._private_key = private_key
        self._funder = funder
        self._signature_type = signature_type
        self._client: ClobClient | None = None
        self._ws: websockets.WebSocketClientProtocol | None = None
        self._ws_task: asyncio.Task | None = None
        self._user_ws_task: asyncio.Task | None = None
        self._ob_callbacks: dict[str, list] = {}
        self._trade_callbacks: dict[str, list] = {}
        self._fill_callbacks: list = []
        self._local_orderbooks: dict[str, OrderBookSnapshot] = {}
        self._market_metadata: dict[str, MarketMetadata] = {}
        self._tick_sizes: dict[str, float] = {}
        self._api_creds = None
        self._complement_tokens: dict[str, str] = {}
        self._primary_tokens: dict[str, str] = {}
        self._order_post_retries = 3
        self._order_retry_delay = 1.0
        self._wallet_address = Account.from_key(private_key).address

    async def _to_thread(self, func, *args, **kwargs):
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, functools.partial(func, *args, **kwargs))

    async def connect(self):
        # py-clob-client defaults to HTTP/2 and a short timeout, which can
        # time out when posting live orders from remote servers.
        http_helpers._http_client = httpx.Client(
            http2=False,
            timeout=httpx.Timeout(30.0, connect=10.0, read=30.0, write=30.0, pool=30.0),
        )

        self._client = ClobClient(
            CLOB_HOST,
            key=self._private_key,
            chain_id=CHAIN_ID,
            signature_type=self._signature_type,
            funder=self._funder,
        )
        creds = await self._to_thread(self._client.create_or_derive_api_creds)
        self._client.set_api_creds(creds)
        self._api_creds = creds
        logger.info("Polymarket CLOB client connected")

    def register_complement(self, yes_token_id: str, no_token_id: str):
        self._complement_tokens[yes_token_id] = no_token_id
        self._primary_tokens[no_token_id] = yes_token_id
        logger.info("Complement pair: YES=%s... -> NO=%s...", yes_token_id[:12], no_token_id[:12])

    async def disconnect(self):
        if self._ws:
            await self._ws.close()
            self._ws = None
        if self._ws_task and not self._ws_task.done():
            self._ws_task.cancel()
            self._ws_task = None
        if self._user_ws_task and not self._user_ws_task.done():
            self._user_ws_task.cancel()
            self._user_ws_task = None
        logger.info("Polymarket disconnected")

    async def get_order_book(self, token_id: str) -> OrderBookSnapshot:
        book = await self._to_thread(self._client.get_order_book, token_id)
        now = time.time()
        bids = [OrderBookLevel(price=float(level.price), size=float(level.size)) for level in (book.bids or [])]
        asks = [OrderBookLevel(price=float(level.price), size=float(level.size)) for level in (book.asks or [])]
        bids.sort(key=lambda level: -level.price)
        asks.sort(key=lambda level: level.price)
        snapshot = OrderBookSnapshot(token_id=token_id, bids=bids, asks=asks, timestamp=now)
        self._local_orderbooks[token_id] = snapshot
        return snapshot

    async def get_midpoint(self, token_id: str) -> float:
        mid = await self._to_thread(self._client.get_midpoint, token_id)
        return float(mid)

    async def prefetch_market_metadata(self, token_ids: list[str]):
        normalized = [token_id for token_id in token_ids if token_id]
        if not normalized:
            return

        params = [("clob_token_ids", token_id) for token_id in normalized]
        async with httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=10.0)) as client:
            response = await client.get(f"{GAMMA_HOST}/markets", params=params)
            response.raise_for_status()
            markets = response.json()

        matched_tokens = set()
        for market in markets:
            raw_token_ids = market.get("clobTokenIds", "[]")
            try:
                token_list = json.loads(raw_token_ids) if isinstance(raw_token_ids, str) else list(raw_token_ids or [])
            except (TypeError, ValueError, json.JSONDecodeError):
                token_list = []

            reward_rates = market.get("clobRewards") or []
            if isinstance(reward_rates, list) and reward_rates:
                daily_rate = float(reward_rates[0].get("rewardsDailyRate", 0.0) or 0.0)
            else:
                daily_rate = 0.0

            metadata = MarketMetadata(
                token_id="",
                question=str(market.get("question", "")),
                slug=str(market.get("slug", "")),
                condition_id=str(market.get("conditionId", "")),
                rewards_min_size=float(market.get("rewardsMinSize") or 0.0),
                rewards_max_spread=float(market.get("rewardsMaxSpread") or 0.0) / 100.0,
                rewards_daily_rate=daily_rate,
                tick_size=float(market.get("orderPriceMinTickSize") or 0.01),
                order_min_size=float(market.get("orderMinSize") or 0.0),
                active=bool(market.get("active", True) and not market.get("closed", False)),
                accepting_orders=bool(market.get("active", True) and not market.get("closed", False)),
            )
            for token_id in token_list:
                if token_id in normalized:
                    matched_tokens.add(token_id)
                self._market_metadata[token_id] = MarketMetadata(
                    token_id=token_id,
                    question=metadata.question,
                    slug=metadata.slug,
                    condition_id=metadata.condition_id,
                    rewards_min_size=metadata.rewards_min_size,
                    rewards_max_spread=metadata.rewards_max_spread,
                    rewards_daily_rate=metadata.rewards_daily_rate,
                    tick_size=metadata.tick_size,
                    order_min_size=metadata.order_min_size,
                    active=metadata.active,
                    accepting_orders=metadata.accepting_orders,
                )
                self._tick_sizes[token_id] = metadata.tick_size

        missing_tokens = [token_id for token_id in normalized if token_id not in matched_tokens]
        for token_id in missing_tokens:
            tick_size = self._tick_sizes.get(token_id)
            if tick_size is None and self._client is not None:
                try:
                    tick_size = float(await self._to_thread(self._client.get_tick_size, token_id))
                except Exception:
                    tick_size = 0.01
            self._market_metadata[token_id] = MarketMetadata(
                token_id=token_id,
                tick_size=tick_size or 0.01,
                active=True,
                accepting_orders=True,
            )
            self._tick_sizes[token_id] = tick_size or 0.01

        logger.info("Prefetched reward metadata for %d/%d markets", len(matched_tokens), len(normalized))

    def get_market_metadata(self, token_id: str) -> MarketMetadata | None:
        return self._market_metadata.get(token_id)

    async def place_limit_order(
        self,
        token_id: str,
        side: Side,
        price: float,
        size: float,
        order_type: OrderType = OrderType.GTC,
    ) -> OrderResponse:
        actual_token = token_id
        actual_side = BUY if side == Side.BUY else SELL
        actual_price = price

        if side == Side.SELL and token_id in self._complement_tokens:
            actual_token = self._complement_tokens[token_id]
            actual_side = BUY
            actual_price = 1.0 - price
            logger.debug("Converted SELL YES@%.2f -> BUY NO@%.2f", price, actual_price)

        actual_price = self._quantize_price(actual_token, actual_price)

        args = OrderArgs(
            token_id=actual_token,
            price=actual_price,
            size=round(size, 1),
            side=actual_side,
        )
        poly_order_type = {
            OrderType.GTC: PolyOrderType.GTC,
            OrderType.FOK: PolyOrderType.FOK,
            OrderType.GTD: PolyOrderType.GTD,
        }.get(order_type, PolyOrderType.GTC)

        signed = await self._to_thread(self._client.create_order, args)
        last_error = ""

        for attempt in range(1, self._order_post_retries + 1):
            try:
                response = await self._to_thread(self._client.post_order, signed, poly_order_type)
                order_id = response.get("orderID", response.get("id", ""))
                success = response.get("success", True) if isinstance(response, dict) else bool(response)
                logger.info("Order placed: %s %s %.2f @ %.4f -> %s", side.value, token_id[:8], size, price, order_id)
                return OrderResponse(order_id=str(order_id), success=success)
            except Exception as exc:
                last_error = str(exc)
                if "Request exception" in last_error and attempt < self._order_post_retries:
                    logger.warning(
                        "Order post timed out for %s %s on attempt %d/%d, retrying",
                        side.value,
                        token_id[:8],
                        attempt,
                        self._order_post_retries,
                    )
                    await asyncio.sleep(self._order_retry_delay * attempt)
                    continue
                logger.error("Order failed: %s", exc)
                break

        return OrderResponse(order_id="", success=False, message=last_error)

    async def cancel_order(self, order_id: str) -> bool:
        try:
            await self._to_thread(self._client.cancel, order_id)
            return True
        except Exception as exc:
            logger.error("Cancel failed for %s: %s", order_id, exc)
            return False

    async def cancel_all_orders(self, token_id: str | None = None) -> int:
        try:
            await self._to_thread(self._client.cancel_all)
            logger.info("All orders cancelled%s", f" (requested for {token_id[:8]})" if token_id else "")
            return 1
        except Exception as exc:
            logger.error("Cancel all failed: %s", exc)
            return 0

    async def get_positions(self) -> list[Position]:
        user = self._funder or self._wallet_address
        if not user:
            return []

        positions: list[dict] = []
        limit = 500
        offset = 0

        async with httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=10.0)) as client:
            while True:
                response = await client.get(
                    f"{DATA_API_HOST}/positions",
                    params={
                        "user": user,
                        "sizeThreshold": 0,
                        "limit": limit,
                        "offset": offset,
                    },
                )
                response.raise_for_status()
                batch = response.json()
                if not isinstance(batch, list) or not batch:
                    break
                positions.extend(batch)
                if len(batch) < limit:
                    break
                offset += limit

        aggregated: dict[str, dict[str, dict[str, float | str]]] = {}
        for item in positions:
            token_id = str(item.get("asset", ""))
            if not token_id:
                continue

            try:
                size = float(item.get("size", 0) or 0.0)
                avg_price = float(item.get("avgPrice", 0) or 0.0)
            except (TypeError, ValueError):
                continue

            if size <= 0:
                continue

            primary_token_id = self._primary_tokens.get(token_id, token_id)
            side_bucket = "no" if token_id in self._primary_tokens else "yes"
            title = str(item.get("title", "")) or primary_token_id[:12]
            entry = aggregated.setdefault(
                primary_token_id,
                {
                    "yes": {"size": 0.0, "notional": 0.0, "title": title},
                    "no": {"size": 0.0, "notional": 0.0, "title": title},
                },
            )
            bucket = entry[side_bucket]
            bucket["size"] = float(bucket["size"]) + size
            bucket["notional"] = float(bucket["notional"]) + size * avg_price
            if title and not bucket["title"]:
                bucket["title"] = title

        normalized_positions: list[Position] = []
        for primary_token_id, entry in aggregated.items():
            yes_size = float(entry["yes"]["size"])
            yes_notional = float(entry["yes"]["notional"])
            no_size = float(entry["no"]["size"])
            no_notional = float(entry["no"]["notional"])
            title = str(entry["yes"]["title"] or entry["no"]["title"] or primary_token_id[:12])

            if yes_size == 0 and no_size == 0:
                continue

            if yes_size > 0 and no_size > 0:
                if yes_size > no_size:
                    net_size = yes_size - no_size
                    avg_price = yes_notional / yes_size if yes_size > 0 else 0.0
                elif no_size > yes_size:
                    net_size = -(no_size - yes_size)
                    avg_no_price = no_notional / no_size if no_size > 0 else 0.0
                    avg_price = 1.0 - avg_no_price
                else:
                    net_size = 0.0
                    avg_price = 0.0
            elif yes_size > 0:
                net_size = yes_size
                avg_price = yes_notional / yes_size if yes_size > 0 else 0.0
            else:
                net_size = -no_size
                avg_no_price = no_notional / no_size if no_size > 0 else 0.0
                avg_price = 1.0 - avg_no_price

            if abs(net_size) <= 0:
                continue

            normalized_positions.append(
                Position(
                    token_id=primary_token_id,
                    size=round(net_size, 4),
                    avg_price=round(float(avg_price), 6),
                    market_name=title,
                )
            )

        logger.info("Fetched %d live positions for %s", len(normalized_positions), user)
        return normalized_positions

    async def get_balance(self) -> float:
        try:
            balance = await self._to_thread(
                self._client.get_balance_allowance,
                BalanceAllowanceParams(
                    asset_type=AssetType.COLLATERAL,
                    signature_type=self._signature_type,
                ),
            )
            if isinstance(balance, dict):
                raw_balance = float(balance.get("balance", 0) or 0.0)
            else:
                raw_balance = float(balance)
            return raw_balance / 1_000_000.0
        except Exception as exc:
            logger.warning("Balance fetch failed: %s", exc)
            return 0.0

    async def subscribe_orderbook(self, token_ids: list[str], callback):
        for token_id in token_ids:
            self._ob_callbacks.setdefault(token_id, []).append(callback)
        if self._ws_task is None or self._ws_task.done():
            self._ws_task = asyncio.create_task(self._ws_market_loop(token_ids))

    async def subscribe_trades(self, token_ids: list[str], callback):
        for token_id in token_ids:
            self._trade_callbacks.setdefault(token_id, []).append(callback)

    async def subscribe_fills(self, callback):
        self._fill_callbacks.append(callback)
        if self._api_creds and (self._user_ws_task is None or self._user_ws_task.done()):
            self._user_ws_task = asyncio.create_task(self._ws_user_loop())

    async def _ws_market_loop(self, token_ids: list[str]):
        backoff = 1.0
        while True:
            try:
                async with websockets.connect(WS_MARKET_URL, ping_interval=30) as ws:
                    self._ws = ws
                    backoff = 1.0
                    await ws.send(json.dumps({"assets_ids": token_ids, "type": "market"}))
                    logger.info("WS market subscribed to %d markets", len(token_ids))

                    async for raw in ws:
                        try:
                            data = json.loads(raw)
                            if isinstance(data, list):
                                for item in data:
                                    if isinstance(item, dict):
                                        await self._handle_market_msg(item)
                            elif isinstance(data, dict):
                                await self._handle_market_msg(data)
                        except json.JSONDecodeError:
                            continue
            except (websockets.ConnectionClosed, ConnectionError, OSError) as exc:
                logger.warning("WS market disconnected: %s - reconnecting in %.0fs", exc, backoff)
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, 60.0)
            except asyncio.CancelledError:
                break

    async def _ws_user_loop(self):
        if not self._api_creds:
            return
        backoff = 1.0
        while True:
            try:
                async with websockets.connect(WS_USER_URL, ping_interval=30) as ws:
                    backoff = 1.0
                    await ws.send(
                        json.dumps(
                            {
                                "auth": {
                                    "apiKey": self._api_creds.api_key,
                                    "secret": self._api_creds.api_secret,
                                    "passphrase": self._api_creds.api_passphrase,
                                },
                                "type": "user",
                            }
                        )
                    )
                    logger.info("WS user channel connected")

                    async for raw in ws:
                        try:
                            data = json.loads(raw)
                            await self._handle_user_msg(data)
                        except json.JSONDecodeError:
                            continue
            except (websockets.ConnectionClosed, ConnectionError, OSError) as exc:
                logger.warning("WS user disconnected: %s - reconnecting in %.0fs", exc, backoff)
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, 60.0)
            except asyncio.CancelledError:
                break

    async def _handle_market_msg(self, data: dict):
        event_type = data.get("event_type", "")
        asset_id = data.get("asset_id", "")

        if event_type == "book" and asset_id:
            now = time.time()
            bids = [OrderBookLevel(price=float(level["price"]), size=float(level["size"])) for level in data.get("bids", [])]
            asks = [OrderBookLevel(price=float(level["price"]), size=float(level["size"])) for level in data.get("asks", [])]
            bids.sort(key=lambda level: -level.price)
            asks.sort(key=lambda level: level.price)
            snapshot = OrderBookSnapshot(token_id=asset_id, bids=bids, asks=asks, timestamp=now)
            self._local_orderbooks[asset_id] = snapshot

            for callback in self._ob_callbacks.get(asset_id, []):
                if asyncio.iscoroutinefunction(callback):
                    await callback(snapshot)
                else:
                    callback(snapshot)
        elif event_type == "trade" and asset_id:
            for callback in self._trade_callbacks.get(asset_id, []):
                if asyncio.iscoroutinefunction(callback):
                    await callback(data)
                else:
                    callback(data)

    async def _handle_user_msg(self, data: dict):
        if data.get("event_type", "") in ("trade", "fill", "order_fill"):
            for callback in self._fill_callbacks:
                if asyncio.iscoroutinefunction(callback):
                    await callback(data)
                else:
                    callback(data)

    def get_cached_orderbook(self, token_id: str) -> OrderBookSnapshot | None:
        return self._local_orderbooks.get(token_id)

    def _quantize_price(self, token_id: str, price: float) -> float:
        tick_size = self._tick_sizes.get(token_id) or self._get_cached_tick_size(token_id)
        if tick_size <= 0:
            return round(price, 4)
        steps = round(price / tick_size)
        quantized = steps * tick_size
        return round(min(max(quantized, tick_size), 1.0 - tick_size), 4)

    def _get_cached_tick_size(self, token_id: str) -> float:
        metadata = self._market_metadata.get(token_id)
        if metadata and metadata.tick_size > 0:
            self._tick_sizes[token_id] = metadata.tick_size
            return metadata.tick_size
        return 0.01
