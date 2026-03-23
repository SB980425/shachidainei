"""
Prediction market LP entry point.
"""
import asyncio
import os
import re
import signal
import sys
from pathlib import Path

import yaml
from dotenv import load_dotenv

from exchange.polymarket import PolymarketExchange
from strategy.market_maker import MarketMaker
from utils.logger import setup_logger

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_ENV_PATH = BASE_DIR / ".env"
ENV_PATH = Path(os.getenv("MM_ENV_FILE", str(DEFAULT_ENV_PATH)))
CONFIG_PATH = Path(os.getenv("MM_CONFIG_FILE", str(BASE_DIR / "config.yaml")))
CONFIG_OVERRIDE_PATH = os.getenv("MM_CONFIG_OVERRIDE_FILE", "")
INSTANCE_NAME = os.getenv("MM_INSTANCE_NAME", "mm")
LOG_PATH = Path(os.getenv("MM_LOG_FILE", str(BASE_DIR / "logs" / f"{INSTANCE_NAME}.log")))

load_dotenv(ENV_PATH)

if not LOG_PATH.is_absolute():
    LOG_PATH = BASE_DIR / LOG_PATH

logger = setup_logger(f"mm.{INSTANCE_NAME}", level="INFO", log_file=str(LOG_PATH))


def _deep_merge(base: dict, override: dict) -> dict:
    result = dict(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = _deep_merge(result[key], value)
        else:
            result[key] = value
    return result


def load_config(path: str | Path = CONFIG_PATH) -> dict:
    with open(path, "r", encoding="utf-8") as file:
        config = yaml.safe_load(file)

    if CONFIG_OVERRIDE_PATH:
        with open(CONFIG_OVERRIDE_PATH, "r", encoding="utf-8") as file:
            override = yaml.safe_load(file) or {}
        config = _deep_merge(config, override)

    return config


def parse_markets(env_markets: str) -> list[dict]:
    """
    Format:
    yes_token|no_token:name:ttx_days,yes_token2|no_token2:name2:ttx_days
    """
    markets = []

    if not env_markets:
        return markets

    def _split_entries(raw: str) -> list[str]:
        return [chunk for chunk in re.split(r",(?=[A-Za-z0-9]+\|[A-Za-z0-9]+:)", raw) if chunk.strip()]

    for raw_entry in _split_entries(env_markets):
        entry = raw_entry.strip()
        if not entry:
            continue

        token_and_name, sep, ttx_part = entry.rpartition(":")
        if not sep:
            logger.warning("Skipping malformed market entry: %s", entry)
            continue

        token_part, sep, name = token_and_name.partition(":")
        if not sep:
            logger.warning("Skipping malformed market entry: %s", entry)
            continue

        tokens = [token.strip() for token in token_part.split("|") if token.strip()]
        if not tokens:
            logger.warning("Skipping malformed market entry: %s", entry)
            continue

        try:
            ttx = float(ttx_part) if ttx_part else 30.0
        except ValueError:
            logger.warning("Invalid TTX in market entry, falling back to 30 days: %s", entry)
            ttx = 30.0

        markets.append(
            {
                "token_id": tokens[0],
                "no_token_id": tokens[1] if len(tokens) > 1 else "",
                "name": name.strip(),
                "ttx": ttx,
            }
        )
    return markets


async def main():
    config = load_config()
    logger.info(
        "Instance=%s env=%s config=%s override=%s",
        INSTANCE_NAME,
        ENV_PATH,
        CONFIG_PATH,
        CONFIG_OVERRIDE_PATH or "-",
    )

    private_key = os.getenv("POLYMARKET_PRIVATE_KEY")
    if not private_key:
        logger.critical("POLYMARKET_PRIVATE_KEY not set in %s", ENV_PATH)
        sys.exit(1)

    funder = os.getenv("POLYMARKET_FUNDER_ADDRESS")
    sig_type = int(os.getenv("POLYMARKET_SIGNATURE_TYPE", "0"))
    markets_str = os.getenv("POLYMARKET_MARKETS", "")
    markets = parse_markets(markets_str)

    if not markets:
        logger.critical("POLYMARKET_MARKETS is empty or malformed in %s", ENV_PATH)
        sys.exit(1)

    exchange = PolymarketExchange(
        private_key=private_key,
        funder=funder,
        signature_type=sig_type,
    )
    mm = MarketMaker(exchange=exchange, config=config)

    for market in markets:
        mm.add_market(
            token_id=market["token_id"],
            market_name=market["name"],
            time_to_expiry=market["ttx"],
            no_token_id=market["no_token_id"],
        )
        if market["no_token_id"]:
            exchange.register_complement(market["token_id"], market["no_token_id"])

    stop_event = asyncio.Event()

    def handle_signal():
        logger.info("Shutdown signal received")
        stop_event.set()

    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        try:
            loop.add_signal_handler(sig, handle_signal)
        except NotImplementedError:
            signal.signal(sig, lambda *_: handle_signal())

    mm_task = asyncio.create_task(mm.start())
    await stop_event.wait()

    await mm.stop()
    mm_task.cancel()
    try:
        await mm_task
    except asyncio.CancelledError:
        pass

    dashboard = mm.get_dashboard()
    logger.info("=== Final Dashboard ===")
    for name, data in dashboard.items():
        tuning = data.get("tuning_decision", {})
        reward = data.get("reward_status", {})
        logger.info(
            "%s: prob=%.4f sig=%.2f forecast=%.2f inv=%.1f ui=%.4f delta=%.4f gamma=%.4f bv=%.2f cv=%.2f pnl=%.2f fills=%d capture=%.2f%% adverse=%.2f%% hold=%.2fh rmse=%.4f hedges=%d tune(spread=%.2f bid=%.2f ask=%.2f pos=%.2f) reward(bid=%s ask=%s mid=%.4f cap=%.4f)",
            name,
            data["prob"],
            data["sigma_b"],
            data["forecast_sigma"],
            data["inventory"],
            data["uncertainty_index"],
            data["delta"],
            data["gamma"],
            data["belief_vega"],
            data["correlation_vega"],
            data["pnl"],
            data["fill_count"],
            data["spread_capture"] * 100,
            data["adverse_selection"] * 100,
            data["avg_inventory_holding_hours"],
            data["vol_forecast_rmse"],
            len(data["hedge_recommendations"]),
            tuning.get("spread_multiplier", 1.0),
            tuning.get("bid_size_multiplier", 1.0),
            tuning.get("ask_size_multiplier", 1.0),
            tuning.get("position_limit_multiplier", 1.0),
            "Y" if reward.get("bid_reward_eligible") else "N",
            "Y" if reward.get("ask_reward_eligible") else "N",
            reward.get("reward_midpoint", data["prob"]),
            reward.get("reward_effective_cap", 0.0),
        )


if __name__ == "__main__":
    asyncio.run(main())
