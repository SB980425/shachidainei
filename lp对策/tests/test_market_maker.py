import unittest

from core.quoting_engine import Quote
from exchange.base import ExchangeBase, MarketMetadata, OrderBookSnapshot, OrderResponse, OrderType, Position, Side
from strategy.market_maker import MarketMaker


class DummyExchange(ExchangeBase):
    def __init__(self, cancel_results=None, tick_size: float = 0.01):
        self.cancel_results = cancel_results or {}
        self.tick_size = tick_size

    async def connect(self):
        return None

    async def disconnect(self):
        return None

    async def get_order_book(self, token_id: str) -> OrderBookSnapshot:
        raise NotImplementedError

    async def get_midpoint(self, token_id: str) -> float:
        raise NotImplementedError

    async def place_limit_order(
        self,
        token_id: str,
        side: Side,
        price: float,
        size: float,
        order_type: OrderType = OrderType.GTC,
    ) -> OrderResponse:
        del token_id, side, price, size, order_type
        return OrderResponse(order_id="new-order", success=True)

    async def cancel_order(self, order_id: str) -> bool:
        return self.cancel_results.get(order_id, True)

    async def cancel_all_orders(self, token_id: str | None = None) -> int:
        del token_id
        return 0

    async def get_positions(self) -> list[Position]:
        return []

    async def get_balance(self) -> float:
        return 0.0

    async def subscribe_orderbook(self, token_ids: list[str], callback):
        del token_ids, callback
        return None

    async def subscribe_trades(self, token_ids: list[str], callback):
        del token_ids, callback
        return None

    def get_market_metadata(self, token_id: str) -> MarketMetadata | None:
        return MarketMetadata(token_id=token_id, tick_size=self.tick_size)


class MarketMakerSafetyTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.exchange = DummyExchange()
        self.mm = MarketMaker(exchange=self.exchange, config={})
        self.mm.add_market(token_id="token-1", market_name="Test Market")
        self.state = self.mm.markets["token-1"]

    async def test_cancel_existing_orders_preserves_failed_side(self):
        self.exchange.cancel_results = {"bid-1": False, "ask-1": True}
        self.state.active_bid_id = "bid-1"
        self.state.active_bid_size = 10.0
        self.state.active_bid_price = 0.45
        self.state.active_bid_ts = 123.0
        self.state.active_ask_id = "ask-1"
        self.state.active_ask_size = 12.0
        self.state.active_ask_price = 0.55
        self.state.active_ask_ts = 124.0

        await self.mm._cancel_existing_orders(self.state)

        self.assertEqual(self.state.active_bid_id, "bid-1")
        self.assertEqual(self.state.active_bid_size, 10.0)
        self.assertEqual(self.state.active_ask_id, "")
        self.assertEqual(self.state.active_ask_size, 0.0)

    def test_price_changed_materially_respects_market_tick_size(self):
        self.exchange.tick_size = 0.001
        self.state.active_bid_price = 0.543
        self.state.active_ask_price = 0.547

        self.assertFalse(self.mm._price_changed_materially(self.state, "bid", 0.5434))
        self.assertFalse(self.mm._price_changed_materially(self.state, "ask", 0.5466))
        self.assertTrue(self.mm._price_changed_materially(self.state, "bid", 0.5441))
        self.assertTrue(self.mm._price_changed_materially(self.state, "ask", 0.5481))

    def test_two_sided_mode_scales_pair_to_market_budget(self):
        mm = MarketMaker(
            exchange=self.exchange,
            config={
                "capital": {
                    "auto_scale_by_balance": False,
                    "total_allocated": 1000.0,
                    "max_per_market": 1000.0,
                    "reserve_ratio": 0.0,
                },
                "two_sided_mode": {
                    "enabled": True,
                    "use_account_balance": True,
                    "relax_inventory_limit": True,
                    "min_size": 1.0,
                },
            },
        )
        mm.add_market(token_id="token-1", market_name="Test Market")
        state = mm.markets["token-1"]
        mm._account_balance = 300.0
        state.reward_status = {
            "reward_min_size": 1000.0,
            "bid_reward_eligible": True,
            "ask_reward_eligible": True,
        }
        quote = Quote(
            bid_prob=0.35,
            ask_prob=0.36,
            bid_logit=0.0,
            ask_logit=0.0,
            mid_prob=0.355,
            mid_logit=0.0,
            spread_prob=0.01,
            spread_logit=0.0,
            inventory_skew_logit=0.0,
        )

        bid_size, ask_size = mm._apply_two_sided_mode(
            state=state,
            quote=quote,
            bid_size=1000.0,
            ask_size=1000.0,
            n_markets=2,
        )

        self.assertEqual((bid_size, ask_size), (151.5, 151.5))
        self.assertFalse(state.reward_status["bid_reward_eligible"])
        self.assertFalse(state.reward_status["ask_reward_eligible"])
