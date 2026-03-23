"""
Market maker strategy orchestration.
"""
import asyncio
import logging
import time
from dataclasses import dataclass, field, replace

import numpy as np

from core.adaptive_tuning import AdaptiveTuningEngine
from core.calibration import CalibrationPipeline, CalibrationResult
from core.greeks import Greeks, PredictionMarketGreeks
from core.hedging import HedgeEngine
from core.logit import LogitTransform, prob_to_logit
from core.quoting_engine import Quote, QuotingEngine
from core.risk_manager import RiskAction, RiskManager
from core.toxicity import VPINDetector
from core.volatility_surface import VolatilitySurface
from exchange.base import ExchangeBase, OrderBookLevel, OrderBookSnapshot, OrderType, Side

logger = logging.getLogger(__name__)


@dataclass
class MarketState:
    token_id: str
    market_name: str
    no_token_id: str = ""
    prob: float = 0.5
    sigma_b: float = 2.0
    inventory: float = 0.0
    avg_entry_price: float = 0.0
    time_to_expiry: float = 30.0
    regime: str = "normal"
    greeks: Greeks | None = None
    last_quote: Quote | None = None
    active_bid_id: str = ""
    active_ask_id: str = ""
    active_bid_size: float = 0.0
    active_ask_size: float = 0.0
    active_bid_price: float = 0.0
    active_ask_price: float = 0.0
    active_bid_ts: float = 0.0
    active_ask_ts: float = 0.0
    calibration: CalibrationResult | None = None
    jump_detected: bool = False
    fill_imbalance_ema: float = 0.0
    last_flow_update_ts: float = 0.0
    uncertainty_index: float = 0.0
    forecast_sigma: float = 2.0
    hedge_recommendations: list[dict] = field(default_factory=list)
    tuning_decision: dict = field(default_factory=dict)
    reward_status: dict = field(default_factory=dict)
    microstructure_status: dict = field(default_factory=dict)
    micro_danger_side: str = "none"
    micro_danger_since_ts: float = 0.0
    micro_danger_observations: int = 0
    _created_time: float = field(default_factory=time.time)
    _initial_ttx: float = 30.0

    def __post_init__(self):
        self._initial_ttx = self.time_to_expiry

    def get_current_ttx(self) -> float:
        elapsed_days = (time.time() - self._created_time) / 86400.0
        return max(self._initial_ttx - elapsed_days, 0.01)


@dataclass
class PerformanceMetrics:
    gross_spread_income: float = 0.0
    adverse_selection_cost: float = 0.0
    total_pnl: float = 0.0
    realized_pnl: float = 0.0
    markout_pnl: float = 0.0
    total_volume: float = 0.0
    fill_count: int = 0
    forecast_error_sq: float = 0.0
    forecast_count: int = 0
    inventory_open_ts: float = 0.0
    inventory_holding_hours_total: float = 0.0
    inventory_holding_samples: int = 0
    start_time: float = field(default_factory=time.time)

    @property
    def spread_capture_ratio(self) -> float:
        if self.gross_spread_income == 0:
            return 0.0
        return max(0.0, self.markout_pnl) / self.gross_spread_income

    @property
    def adverse_selection_ratio(self) -> float:
        if self.gross_spread_income == 0:
            return 0.0
        return self.adverse_selection_cost / self.gross_spread_income

    @property
    def vol_forecast_rmse(self) -> float:
        if self.forecast_count == 0:
            return 0.0
        return float(np.sqrt(self.forecast_error_sq / self.forecast_count))

    @property
    def avg_inventory_holding_hours(self) -> float:
        if self.inventory_holding_samples == 0:
            return 0.0
        return self.inventory_holding_hours_total / self.inventory_holding_samples


@dataclass
class SizingPlan:
    """Pre-computed sizing inputs used by the quoting loop."""
    max_position: float
    capital_per_market: float
    market_count: int
    bid_signal_strength: float
    ask_signal_strength: float
    bid_size: float
    ask_size: float


class MarketMaker:
    def __init__(self, exchange: ExchangeBase, config: dict):
        self.exchange = exchange
        self.config = config

        self.logit = LogitTransform()
        self.calibrators: dict[str, CalibrationPipeline] = {}
        self.vol_surface = VolatilitySurface(config)
        self.risk_mgr = RiskManager(config)
        self.quoting = QuotingEngine(config)
        self.hedging = HedgeEngine(config)
        self.tuner = AdaptiveTuningEngine(config)
        self.greeks = PredictionMarketGreeks()

        quoting_cfg = config.get("quoting", {})
        capital_cfg = config.get("capital", {})
        multi_market_cfg = config.get("multi_market", {})
        adaptive_cfg = config.get("adaptive_tuning", {})
        reward_cfg = config.get("reward_priority", {})
        fill_cfg = config.get("fills", {})
        micro_guard_cfg = config.get("microstructure_guard", {})
        stale_guard_cfg = config.get("stale_order_guard", {})
        two_sided_cfg = config.get("two_sided_mode", {})
        self._market_overrides = config.get("market_overrides", {})

        self.markets: dict[str, MarketState] = {}
        self.metrics: dict[str, PerformanceMetrics] = {}
        self._complement_to_primary: dict[str, str] = {}
        self._seen_fill_ids: dict[str, float] = {}
        self._running = False
        self._correlation_matrix: np.ndarray | None = None
        self._quote_refresh_ms = quoting_cfg.get("quote_refresh_ms", 500)
        self._size_update_threshold_ratio = quoting_cfg.get("size_update_threshold_ratio", 0.2)
        self._total_capital = capital_cfg.get("total_allocated", 1000.0)
        self._max_per_market = capital_cfg.get("max_per_market", 1000.0)
        self._reserve_ratio = capital_cfg.get("reserve_ratio", 0.20)
        self._balance_sizing_enabled = bool(capital_cfg.get("auto_scale_by_balance", True))
        self._balance_refresh_seconds = float(capital_cfg.get("balance_refresh_seconds", 60.0))
        self._min_balance_size_scale = float(capital_cfg.get("min_balance_size_scale", 0.10))
        self._max_balance_size_scale = float(capital_cfg.get("max_balance_size_scale", 1.00))
        self._account_balance = 0.0
        self._effective_total_capital = self._total_capital
        self._balance_size_scale = 1.0
        self._last_balance_refresh = 0.0
        self._orderbook_max_age_seconds = max(self._quote_refresh_ms / 1000.0 * 4.0, 2.0)
        self._correlation_window = multi_market_cfg.get("correlation_window", 720)
        self._correlation_update_interval = multi_market_cfg.get("correlation_update_interval", 60)
        self._min_contracts_for_correlation = multi_market_cfg.get("min_contracts_for_correlation", 3)
        self._last_correlation_update = 0.0
        self._imbalance_levels = quoting_cfg.get("imbalance_levels", 3)
        self._fill_bias_halflife_seconds = quoting_cfg.get("fill_bias_halflife_seconds", 90.0)
        self._fill_signal_size_scale = quoting_cfg.get("fill_signal_size_scale", 300.0)
        self._portfolio_snapshot = None
        self._adaptive_min_size_ratio = adaptive_cfg.get("min_order_size_ratio", 0.50)
        self._reward_priority_enabled = reward_cfg.get("enabled", False)
        self._reward_strict_inside_max_spread = reward_cfg.get("strict_inside_max_spread", True)
        self._reward_enforce_min_size = reward_cfg.get("enforce_min_size", True)
        self._reward_metadata_refresh_seconds = reward_cfg.get("metadata_refresh_seconds", 1800)
        self._last_reward_metadata_refresh = 0.0
        self._fill_dedupe_window_seconds = float(fill_cfg.get("dedupe_window_seconds", 600.0))
        self._micro_guard_enabled = bool(micro_guard_cfg.get("enabled", True))
        self._micro_guard_levels = int(micro_guard_cfg.get("levels", self._imbalance_levels))
        self._micro_guard_max_spread_ticks = int(micro_guard_cfg.get("max_spread_ticks_for_guard", 1))
        self._micro_guard_retreat_ratio = float(micro_guard_cfg.get("retreat_depth_ratio", 20.0))
        self._micro_guard_disable_ratio = float(micro_guard_cfg.get("disable_depth_ratio", 50.0))
        self._micro_guard_retreat_ticks = int(micro_guard_cfg.get("retreat_ticks", 1))
        self._micro_guard_retreat_size_factor = float(micro_guard_cfg.get("retreat_size_factor", 0.5))
        self._micro_guard_min_depth_notional = float(micro_guard_cfg.get("min_depth_notional", 5000.0))
        self._micro_guard_top_level_retreat_ratio = float(micro_guard_cfg.get("top_level_retreat_ratio", 10.0))
        self._micro_guard_top_level_disable_ratio = float(micro_guard_cfg.get("top_level_disable_ratio", 30.0))
        self._micro_guard_top_level_min_depth_notional = float(micro_guard_cfg.get("top_level_min_depth_notional", 1000.0))
        self._micro_guard_sustained_disable_seconds = float(
            micro_guard_cfg.get("sustained_disable_seconds", 3.0)
        )
        self._micro_guard_sustained_disable_min_observations = int(
            micro_guard_cfg.get("sustained_disable_min_observations", 4)
        )
        self._stale_guard_enabled = bool(stale_guard_cfg.get("enabled", True))
        self._stale_guard_max_order_age_seconds = float(stale_guard_cfg.get("max_order_age_seconds", 30.0))
        self._stale_guard_same_tick_only = bool(stale_guard_cfg.get("same_tick_only", True))
        self._stale_guard_dangerous_side_only = bool(stale_guard_cfg.get("dangerous_side_only", True))
        self._stale_guard_min_adverse_drift_ticks = float(stale_guard_cfg.get("min_adverse_drift_ticks", 0.25))
        self._stale_guard_min_side_signal_strength = float(stale_guard_cfg.get("min_side_signal_strength", 0.35))
        self._stale_guard_min_fill_pressure = float(stale_guard_cfg.get("min_fill_pressure", 0.15))
        self._two_sided_mode_enabled = bool(two_sided_cfg.get("enabled", False))
        self._two_sided_use_account_balance = bool(two_sided_cfg.get("use_account_balance", True))
        self._two_sided_relax_inventory_limit = bool(two_sided_cfg.get("relax_inventory_limit", True))
        self._two_sided_min_size = float(two_sided_cfg.get("min_size", 1.0))

        # VPIN 毒性流量检测
        self._vpin_detectors: dict[str, VPINDetector] = {}
        # 成交后冷却期
        cooldown_cfg = config.get("cooldown", {})
        self._cooldown_seconds = float(cooldown_cfg.get("post_fill_seconds", 2.0))
        self._last_fill_time: dict[str, float] = {}
        # 连续同向成交急停
        burst_cfg = config.get("burst_guard", {})
        self._burst_window_seconds = float(burst_cfg.get("window_seconds", 5.0))
        self._burst_max_same_side = int(burst_cfg.get("max_same_side", 3))
        self._burst_pause_seconds = float(burst_cfg.get("pause_seconds", 5.0))
        self._recent_fills: dict[str, list[tuple[float, str]]] = {}  # token -> [(ts, side)]
        self._burst_pause_until: dict[str, dict[str, float]] = {}    # token -> {side: resume_ts}
        # 单边挂单: 有库存时只挂减仓方向
        self._inventory_only_reduce = bool(config.get("inventory_only_reduce", True))
        # orderbook 厚度最低要求
        self._min_book_depth_notional = float(config.get("min_book_depth_notional", 500.0))
        # 自适应报价刷新频率
        adaptive_refresh_cfg = config.get("adaptive_refresh", {})
        self._adaptive_refresh_enabled = bool(adaptive_refresh_cfg.get("enabled", True))
        self._fast_refresh_ms = float(adaptive_refresh_cfg.get("fast_refresh_ms", 100.0))
        self._fast_refresh_fill_rate = float(adaptive_refresh_cfg.get("fill_rate_threshold", 2.0))  # 笔/秒
        self._fast_refresh_window = float(adaptive_refresh_cfg.get("window_seconds", 5.0))
        self._current_refresh_ms = float(self._quote_refresh_ms)

    def add_market(
        self,
        token_id: str,
        market_name: str = "",
        time_to_expiry: float = 30.0,
        no_token_id: str = "",
    ):
        self.markets[token_id] = MarketState(
            token_id=token_id,
            market_name=market_name or token_id[:12],
            no_token_id=no_token_id,
            time_to_expiry=time_to_expiry,
        )
        if no_token_id:
            self._complement_to_primary[no_token_id] = token_id
        self.calibrators[token_id] = CalibrationPipeline(self.config)
        self.metrics[token_id] = PerformanceMetrics()
        self._vpin_detectors[token_id] = VPINDetector(self.config)
        logger.info("Market added: %s (%s) TTX=%.1fd", token_id[:12], market_name, time_to_expiry)

    async def start(self):
        self._running = True
        await self.exchange.connect()
        await self._refresh_account_balance(force=True)
        await self.exchange.cancel_all_orders()
        logger.info("Startup: cancelled all stale orders")
        await self._refresh_reward_metadata(force=True)
        await self._sync_positions_from_exchange()

        token_ids = list(self.markets.keys())
        orderbook_tokens = list(token_ids)
        orderbook_tokens.extend(
            state.no_token_id
            for state in self.markets.values()
            if state.no_token_id
        )
        orderbook_tokens = list(dict.fromkeys(orderbook_tokens))
        await self.exchange.subscribe_orderbook(orderbook_tokens, self._on_orderbook_update)

        if hasattr(self.exchange, "subscribe_fills"):
            await self.exchange.subscribe_fills(self._on_fill_event)

        logger.info("Market maker started with %d markets", len(token_ids))

        try:
            while self._running:
                await self._main_loop()
                self._update_refresh_rate()
                await asyncio.sleep(self._current_refresh_ms / 1000.0)
        except asyncio.CancelledError:
            logger.info("Market maker cancelled")

    async def stop(self):
        self._running = False
        logger.info("Stopping market maker and cancelling all orders")
        await asyncio.gather(*(self._cancel_existing_orders(state) for state in self.markets.values()))
        await self.exchange.disconnect()
        logger.info("Market maker stopped")

    async def _main_loop(self):
        await self._refresh_account_balance()
        await self._refresh_reward_metadata()
        equity_basis = self._account_balance if self._account_balance > 0 else self._effective_total_capital
        self.risk_mgr.maybe_reset_daily(max(equity_basis, 1.0))
        self._update_correlation_matrix()

        states = list(self.markets.values())
        results = await asyncio.gather(
            *(self._process_market(state) for state in states),
            return_exceptions=True,
        )
        for state, result in zip(states, results):
            if isinstance(result, Exception):
                logger.error("Error processing %s: %s", state.market_name, result, exc_info=result)

        if self.vol_surface.needs_update():
            self.vol_surface.rebuild()

    async def _process_market(self, state: MarketState):
        ttx = state.get_current_ttx()
        state.time_to_expiry = ttx

        ob = await self._get_effective_orderbook(state)

        mid_prob = ob.mid_price
        if mid_prob <= 0 or mid_prob >= 1:
            return

        state.prob = mid_prob
        now = time.time()

        previous_logit_state = self.logit.get_latest(state.token_id)
        if previous_logit_state is not None:
            dt_days = max((now - previous_logit_state.timestamp) / 86400.0, 1.0 / 86400.0)
        else:
            dt_days = max(self._quote_refresh_ms / 1000.0, 1.0) / 86400.0

        logit_state = self.logit.update(state.token_id, mid_prob, now)
        spread_logit = (
            float(prob_to_logit(ob.best_ask) - prob_to_logit(ob.best_bid))
            if ob.spread > 0
            else 0.5
        )
        cal = self.calibrators[state.token_id].update(
            logit_state.logit,
            spread_logit=spread_logit,
            dt=dt_days,
        )
        state.calibration = cal
        state.sigma_b = cal.jd_params.sigma_b
        state.regime = cal.regime
        state.jump_detected = cal.jump_detected

        metrics = self.metrics.get(state.token_id)
        previous_forecast_sigma = float(state.forecast_sigma) if np.isfinite(state.forecast_sigma) else 0.0
        surface_sigma = self.vol_surface.query(ttx, mid_prob)
        returns = self.logit.get_logit_returns(state.token_id, n=1)
        if len(returns) > 0:
            realized_sigma = abs(float(returns[-1])) / np.sqrt(max(dt_days, 1e-4)) * np.sqrt(252)
            realized_sigma = float(np.clip(realized_sigma, 0.0, 20.0))
            if metrics and previous_forecast_sigma > 0 and np.isfinite(realized_sigma):
                metrics.forecast_error_sq += (realized_sigma - previous_forecast_sigma) ** 2
                metrics.forecast_count += 1
            self.vol_surface.add_observation(now, ttx, mid_prob, float(returns[-1]))

        book_imbalance = self._compute_book_imbalance(ob)
        fill_imbalance = self._decay_fill_imbalance(state, now)

        inventories = [market.inventory for market in self.markets.values()]
        probs = [market.prob for market in self.markets.values()]
        state.greeks = self.greeks.compute_all(
            p=mid_prob,
            inventory=state.inventory,
            sigma_b=state.sigma_b,
            time_to_expiry=ttx,
            inventories=inventories,
            probs=probs,
            correlation_matrix=self._correlation_matrix,
        )

        effective_sigma = max(state.sigma_b, surface_sigma)
        if not np.isfinite(effective_sigma):
            effective_sigma = 2.0
        effective_sigma = float(np.clip(effective_sigma, 0.5, 20.0))
        state.forecast_sigma = surface_sigma
        state.uncertainty_index = PredictionMarketGreeks.uncertainty_index(mid_prob)

        self.risk_mgr.update_position(
            state.token_id,
            state.inventory,
            mid_prob,
            state.market_name,
            sigma_b=effective_sigma,
            time_to_expiry=ttx,
        )
        risk_state = self.risk_mgr.check_risk(
            regime=state.regime,
            jump_detected=state.jump_detected,
            correlation_matrix=self._correlation_matrix,
            token_id=state.token_id,
            sigma_b=state.sigma_b,
            forecast_sigma=surface_sigma,
            time_to_expiry=ttx,
        )
        portfolio_snapshot = self.risk_mgr.get_portfolio_greeks(self._correlation_matrix)
        tuning = self.tuner.decide(state, metrics, portfolio_snapshot)
        state.tuning_decision = tuning.to_dict()

        if risk_state.action == RiskAction.FULL_WITHDRAWAL:
            logger.critical("FULL WITHDRAWAL for %s", state.market_name)
            await self._cancel_existing_orders(state)
            return

        if risk_state.action == RiskAction.PAUSE_QUOTING:
            logger.warning("PAUSED %s: %s", state.market_name, risk_state.reason)
            await self._cancel_existing_orders(state)
            return

        # 成交后冷却期: 防止连续逆向选择
        last_fill = self._last_fill_time.get(state.token_id, 0.0)
        if now - last_fill < self._cooldown_seconds:
            return

        # VPIN 毒性检测
        vpin_detector = self._vpin_detectors.get(state.token_id)
        toxicity_spread_mult = 1.0
        if vpin_detector:
            toxicity = vpin_detector.evaluate(now)
            if toxicity.should_withdraw:
                logger.warning("[%s] VPIN=%.4f toxic, withdrawing", state.market_name, toxicity.vpin)
                await self._cancel_existing_orders(state)
                return
            if toxicity.is_toxic:
                toxicity_spread_mult = toxicity.spread_multiplier

        # Orderbook 厚度检测: 对手方太薄则不挂单（容易被扫）
        bid_depth_notional = sum(l.price * l.size for l in ob.bids[:3])
        ask_depth_notional = sum(l.price * l.size for l in ob.asks[:3])
        if bid_depth_notional < self._min_book_depth_notional and ask_depth_notional < self._min_book_depth_notional:
            await self._cancel_existing_orders(state)
            return

        effective_spread_mult = risk_state.spread_multiplier * tuning.spread_multiplier * toxicity_spread_mult

        quote = self.quoting.compute_quote(
            mid_prob=mid_prob,
            sigma_b=effective_sigma,
            inventory=state.inventory,
            time_to_expiry=ttx,
            spread_multiplier=effective_spread_mult,
            book_imbalance=book_imbalance,
            fill_imbalance=fill_imbalance,
        )

        sizing = self._build_sizing_plan(
            state=state,
            mid_prob=mid_prob,
            effective_sigma=effective_sigma,
            risk_state=risk_state,
            tuning=tuning,
            book_imbalance=book_imbalance,
            fill_imbalance=fill_imbalance,
        )

        bid_size = sizing.bid_size
        ask_size = sizing.ask_size
        order_size_floor = self._scale_by_balance(
            self._get_market_override(state, "order_size_floor", 0.0)
        )
        if order_size_floor > 0:
            bid_size = min(sizing.max_position, max(bid_size, order_size_floor))
            ask_size = min(sizing.max_position, max(ask_size, order_size_floor))

        all_token_ids = list(self.markets.keys())
        all_inventories_h = [m.inventory for m in self.markets.values()]
        all_probs_h = [m.prob for m in self.markets.values()]
        state.hedge_recommendations = [
            rec.to_dict()
            for rec in self.hedging.recommend(
                market_name=state.market_name,
                token_id=state.token_id,
                no_token_id=state.no_token_id,
                prob=mid_prob,
                inventory=state.inventory,
                max_position=sizing.max_position,
                sigma_b=effective_sigma,
                time_to_expiry=ttx,
                all_inventories=all_inventories_h,
                all_probs=all_probs_h,
                all_token_ids=all_token_ids,
                correlation_matrix=self._correlation_matrix,
            )
        ]

        quote, bid_size, ask_size = self._apply_reward_constraints(
            state,
            ob,
            quote,
            bid_size,
            ask_size,
            max_position=sizing.max_position,
        )

        order_size_cap = self._get_market_override(state, "order_size_cap", 0.0)
        if order_size_cap > 0:
            bid_size = min(bid_size, order_size_cap)
            ask_size = min(ask_size, order_size_cap)

        bid_size, ask_size = self._apply_two_sided_mode(
            state=state,
            quote=quote,
            bid_size=bid_size,
            ask_size=ask_size,
            n_markets=sizing.market_count,
        )

        # 余额预检: 下单成本不超过可用余额的份额
        if self._account_balance > 0:
            n_mkts = max(len(self.markets), 1)
            available_per_market = self._account_balance / n_mkts
            bid_cost = bid_size * max(quote.bid_prob, 0.01)
            ask_cost = ask_size * max(1.0 - quote.ask_prob, 0.01)
            if bid_cost > available_per_market and bid_size > 0:
                bid_size = max(self.quoting.min_order_size, available_per_market / max(quote.bid_prob, 0.01))
                bid_size = round(bid_size, 1)
            if ask_cost > available_per_market and ask_size > 0:
                ask_size = max(self.quoting.min_order_size, available_per_market / max(1.0 - quote.ask_prob, 0.01))
                ask_size = round(ask_size, 1)

        quote, bid_size, ask_size, bid_enabled, ask_enabled = self._apply_microstructure_guard(
            state,
            ob,
            quote,
            bid_size,
            ask_size,
        )

        # 连续同向成交急停: 某方向 burst 后暂停该方向挂单
        burst_pauses = self._burst_pause_until.get(state.token_id, {})
        if burst_pauses.get("BUY", 0.0) > now:
            bid_size = 0.0
            bid_enabled = False
        if burst_pauses.get("SELL", 0.0) > now:
            ask_size = 0.0
            ask_enabled = False

        # 单边挂单: 有显著库存时只挂减仓方向，减少逆向选择
        if self._inventory_only_reduce and abs(state.inventory) > sizing.max_position * 0.3:
            if state.inventory > 0:
                # 持多仓 → 只挂 ask（卖出减仓），禁 bid
                bid_size = 0.0
                bid_enabled = False
            else:
                # 持空仓 → 只挂 bid（买入减仓），禁 ask
                ask_size = 0.0
                ask_enabled = False

        bid_allowed = False
        ask_allowed = False
        position_limit_override = sizing.max_position
        if self._two_sided_mode_enabled and self._two_sided_relax_inventory_limit:
            position_limit_override = max(
                position_limit_override,
                abs(state.inventory) + max(bid_size, ask_size) + 1.0,
            )
        if bid_enabled:
            bid_allowed, _ = self.risk_mgr.check_order_allowed(
                state.token_id,
                "BUY",
                bid_size,
                quote.bid_prob,
                position_limit_override=position_limit_override,
            )
        if ask_enabled:
            ask_allowed, _ = self.risk_mgr.check_order_allowed(
                state.token_id,
                "SELL",
                ask_size,
                quote.ask_prob,
                position_limit_override=position_limit_override,
            )

        if not (np.isfinite(quote.bid_prob) and np.isfinite(quote.ask_prob)):
            logger.warning("[%s] Invalid quote, skipping", state.market_name)
            return
        if quote.bid_prob < 0.01 or quote.ask_prob > 0.99:
            logger.warning(
                "[%s] Quote out of range bid=%.4f ask=%.4f",
                state.market_name,
                quote.bid_prob,
                quote.ask_prob,
            )
            return

        bid_price = self._normalize_order_price(state, "bid", quote.bid_prob)
        ask_price = self._normalize_order_price(state, "ask", quote.ask_prob)

        # 盘口锚定: 报价偏离 best_bid/best_ask 超过阈值时强制撤单
        anchor_threshold = 0.005  # 0.5%
        best_bid = ob.bids[0].price if ob.bids else 0.0
        best_ask = ob.asks[0].price if ob.asks else 1.0
        if bid_enabled and best_bid > 0 and bid_price > best_bid + anchor_threshold:
            logger.info(
                "[%s] Anchor guard: bid=%.4f > best_bid=%.4f + %.3f, pulling back",
                state.market_name, bid_price, best_bid, anchor_threshold,
            )
            bid_price = best_bid
            quote = replace(quote, bid_prob=round(bid_price, 4))
        if ask_enabled and best_ask < 1.0 and ask_price < best_ask - anchor_threshold:
            logger.info(
                "[%s] Anchor guard: ask=%.4f < best_ask=%.4f - %.3f, pulling back",
                state.market_name, ask_price, best_ask, anchor_threshold,
            )
            ask_price = best_ask
            quote = replace(quote, ask_prob=round(ask_price, 4))

        need_bid_update = bid_enabled
        need_ask_update = ask_enabled
        bid_stale_reason: dict = {}
        ask_stale_reason: dict = {}
        bid_stale_refresh = False
        ask_stale_refresh = False

        if bid_enabled:
            need_bid_update = (
                not state.active_bid_id
                or self._price_changed_materially(state, "bid", quote.bid_prob)
                or self._size_changed_materially(state.active_bid_size, bid_size)
            )
        if ask_enabled:
            need_ask_update = (
                not state.active_ask_id
                or self._price_changed_materially(state, "ask", quote.ask_prob)
                or self._size_changed_materially(state.active_ask_size, ask_size)
            )

        if not bid_enabled and state.active_bid_id:
            need_bid_update = True
        if not ask_enabled and state.active_ask_id:
            need_ask_update = True
        if bid_enabled and not bid_allowed and state.active_bid_id:
            need_bid_update = True
        if ask_enabled and not ask_allowed and state.active_ask_id:
            need_ask_update = True

        if bid_enabled and bid_allowed and state.active_bid_id:
            bid_stale_refresh, bid_stale_reason = self._should_refresh_stale_order(
                state=state,
                side_name="bid",
                proposed_price=quote.bid_prob,
                side_signal_strength=sizing.bid_signal_strength,
                fill_imbalance=fill_imbalance,
                now=now,
            )
            need_bid_update = need_bid_update or bid_stale_refresh
        if ask_enabled and ask_allowed and state.active_ask_id:
            ask_stale_refresh, ask_stale_reason = self._should_refresh_stale_order(
                state=state,
                side_name="ask",
                proposed_price=quote.ask_prob,
                side_signal_strength=sizing.ask_signal_strength,
                fill_imbalance=fill_imbalance,
                now=now,
            )
            need_ask_update = need_ask_update or ask_stale_refresh

        if not need_bid_update and not need_ask_update:
            return

        old_bid_id = state.active_bid_id
        old_bid_size = state.active_bid_size
        old_bid_price = state.active_bid_price
        old_bid_ts = state.active_bid_ts
        old_ask_id = state.active_ask_id
        old_ask_size = state.active_ask_size
        old_ask_price = state.active_ask_price
        old_ask_ts = state.active_ask_ts
        bid_cancel_first = (
            bid_stale_refresh
            and old_bid_id
            and abs(state.active_bid_price - bid_price) < 1e-9
            and not self._size_changed_materially(state.active_bid_size, bid_size)
        )
        ask_cancel_first = (
            ask_stale_refresh
            and old_ask_id
            and abs(state.active_ask_price - ask_price) < 1e-9
            and not self._size_changed_materially(state.active_ask_size, ask_size)
        )

        if bid_cancel_first:
            cancelled = await self.exchange.cancel_order(old_bid_id)
            if cancelled:
                logger.info(
                    "[%s] Stale bid refresh age=%.1fs drift=%.2ft signal=%.2f fill=%.2f",
                    state.market_name,
                    bid_stale_reason.get("age_seconds", 0.0),
                    bid_stale_reason.get("adverse_drift_ticks", 0.0),
                    bid_stale_reason.get("side_signal_strength", 0.0),
                    bid_stale_reason.get("fill_pressure", 0.0),
                )
                old_bid_id = ""
                state.active_bid_id = ""
                state.active_bid_size = 0.0
                state.active_bid_price = 0.0
                state.active_bid_ts = 0.0
            else:
                logger.warning("[%s] Stale bid refresh cancel failed; keeping existing order", state.market_name)
                need_bid_update = False
                bid_cancel_first = False
                bid_stale_refresh = False

        if ask_cancel_first:
            cancelled = await self.exchange.cancel_order(old_ask_id)
            if cancelled:
                logger.info(
                    "[%s] Stale ask refresh age=%.1fs drift=%.2ft signal=%.2f fill=%.2f",
                    state.market_name,
                    ask_stale_reason.get("age_seconds", 0.0),
                    ask_stale_reason.get("adverse_drift_ticks", 0.0),
                    ask_stale_reason.get("side_signal_strength", 0.0),
                    ask_stale_reason.get("fill_pressure", 0.0),
                )
                old_ask_id = ""
                state.active_ask_id = ""
                state.active_ask_size = 0.0
                state.active_ask_price = 0.0
                state.active_ask_ts = 0.0
            else:
                logger.warning("[%s] Stale ask refresh cancel failed; keeping existing order", state.market_name)
                need_ask_update = False
                ask_cancel_first = False
                ask_stale_refresh = False

        placements: list[tuple[str, asyncio.Task]] = []
        if need_bid_update and bid_enabled and bid_allowed:
            placements.append((
                "bid",
                asyncio.create_task(
                    self.exchange.place_limit_order(
                        state.token_id,
                        Side.BUY,
                        quote.bid_prob,
                        bid_size,
                        OrderType.GTC,
                    )
                ),
            ))
        if need_ask_update and ask_enabled and ask_allowed:
            placements.append((
                "ask",
                asyncio.create_task(
                    self.exchange.place_limit_order(
                        state.token_id,
                        Side.SELL,
                        quote.ask_prob,
                        ask_size,
                        OrderType.GTC,
                    )
                ),
            ))

        placement_results: dict[str, object] = {}
        if placements:
            results = await asyncio.gather(*(task for _, task in placements), return_exceptions=True)
            for (side_name, _), result in zip(placements, results):
                placement_results[side_name] = result

        bid_replace_succeeded = False
        ask_replace_succeeded = False

        bid_result = placement_results.get("bid")
        if bid_result is not None:
            if isinstance(bid_result, Exception):
                logger.error("Bid placement failed for %s: %s", state.market_name, bid_result, exc_info=bid_result)
            elif getattr(bid_result, "success", False):
                state.active_bid_id = bid_result.order_id
                state.active_bid_size = bid_size
                state.active_bid_price = bid_price
                state.active_bid_ts = time.time()
                bid_replace_succeeded = True

        ask_result = placement_results.get("ask")
        if ask_result is not None:
            if isinstance(ask_result, Exception):
                logger.error("Ask placement failed for %s: %s", state.market_name, ask_result, exc_info=ask_result)
            elif getattr(ask_result, "success", False):
                state.active_ask_id = ask_result.order_id
                state.active_ask_size = ask_size
                state.active_ask_price = ask_price
                state.active_ask_ts = time.time()
                ask_replace_succeeded = True

        bid_withdrawn = need_bid_update and (not bid_enabled or not bid_allowed)
        ask_withdrawn = need_ask_update and (not ask_enabled or not ask_allowed)

        if need_bid_update and old_bid_id and (bid_replace_succeeded or bid_withdrawn):
            cancelled = await self.exchange.cancel_order(old_bid_id)
            if not cancelled and bid_replace_succeeded:
                logger.error("[%s] Old bid cancel failed after replacement; rolling back new bid", state.market_name)
                rollback_ok = await self.exchange.cancel_order(state.active_bid_id)
                if rollback_ok:
                    state.active_bid_id = old_bid_id
                    state.active_bid_size = old_bid_size
                    state.active_bid_price = old_bid_price
                    state.active_bid_ts = old_bid_ts
                    bid_replace_succeeded = False
                else:
                    self._running = False
                    raise RuntimeError(
                        f"{state.market_name}: bid replacement left live-order state unresolved"
                    )
            elif not cancelled and bid_withdrawn:
                logger.warning("[%s] Bid withdrawal cancel failed; preserving existing live bid state", state.market_name)
                bid_withdrawn = False
                state.active_bid_id = old_bid_id
                state.active_bid_size = old_bid_size
                state.active_bid_price = old_bid_price
                state.active_bid_ts = old_bid_ts

        if need_ask_update and old_ask_id and (ask_replace_succeeded or ask_withdrawn):
            cancelled = await self.exchange.cancel_order(old_ask_id)
            if not cancelled and ask_replace_succeeded:
                logger.error("[%s] Old ask cancel failed after replacement; rolling back new ask", state.market_name)
                rollback_ok = await self.exchange.cancel_order(state.active_ask_id)
                if rollback_ok:
                    state.active_ask_id = old_ask_id
                    state.active_ask_size = old_ask_size
                    state.active_ask_price = old_ask_price
                    state.active_ask_ts = old_ask_ts
                    ask_replace_succeeded = False
                else:
                    self._running = False
                    raise RuntimeError(
                        f"{state.market_name}: ask replacement left live-order state unresolved"
                    )
            elif not cancelled and ask_withdrawn:
                logger.warning("[%s] Ask withdrawal cancel failed; preserving existing live ask state", state.market_name)
                ask_withdrawn = False
                state.active_ask_id = old_ask_id
                state.active_ask_size = old_ask_size
                state.active_ask_price = old_ask_price
                state.active_ask_ts = old_ask_ts

        if bid_withdrawn:
            state.active_bid_id = ""
            state.active_bid_size = 0.0
            state.active_bid_price = 0.0
            state.active_bid_ts = 0.0
        if ask_withdrawn:
            state.active_ask_id = ""
            state.active_ask_size = 0.0
            state.active_ask_price = 0.0
            state.active_ask_ts = 0.0

        if (
            bid_replace_succeeded
            or ask_replace_succeeded
            or bid_withdrawn
            or ask_withdrawn
            or (not need_bid_update and not need_ask_update)
        ):
            state.last_quote = quote

        self._portfolio_snapshot = portfolio_snapshot

        logger.info(
            "[%s] mid=%.4f sigma=%.2f forecast=%.2f regime=%s inv=%.1f ui=%.4f | bid=%.4f ask=%.4f spread=%.4f inv_skew=%.4f depth=%.3f fill=%.3f micro=%s:%s:%.1f:%s | delta=%.4f gamma=%.4f bv=%.2f cv=%.2f hedges=%d tune_spread=%.2f tune_bid=%.2f tune_ask=%.2f tune_pos=%.2f reward=%s/%s",
            state.market_name,
            mid_prob,
            effective_sigma,
            surface_sigma,
            state.regime,
            state.inventory,
            state.uncertainty_index,
            quote.bid_prob,
            quote.ask_prob,
            quote.spread_prob,
            quote.inventory_skew_logit,
            book_imbalance,
            fill_imbalance,
            state.microstructure_status.get("action", "none"),
            state.microstructure_status.get("dangerous_side", "none"),
            state.microstructure_status.get("effective_ratio", 0.0),
            state.microstructure_status.get("trigger_source", "none"),
            state.greeks.delta,
            state.greeks.gamma,
            state.greeks.belief_vega,
            state.greeks.correlation_vega,
            len(state.hedge_recommendations),
            tuning.spread_multiplier,
            tuning.bid_size_multiplier,
            tuning.ask_size_multiplier,
            tuning.position_limit_multiplier,
            "Y" if state.reward_status.get("bid_reward_eligible") else "N",
            "Y" if state.reward_status.get("ask_reward_eligible") else "N",
        )

    async def _get_effective_orderbook(self, state: MarketState) -> OrderBookSnapshot:
        primary_orderbook = await self._get_latest_orderbook(state.token_id)
        if not state.no_token_id:
            return primary_orderbook

        complement_orderbook = await self._get_latest_orderbook(state.no_token_id)
        return self._build_display_orderbook(
            state.token_id,
            primary_orderbook,
            complement_orderbook,
        )

    async def _get_latest_orderbook(self, token_id: str) -> OrderBookSnapshot:
        get_cached = getattr(self.exchange, "get_cached_orderbook", None)
        snapshot = get_cached(token_id) if callable(get_cached) else None
        now = time.time()
        if snapshot is not None and now - snapshot.timestamp <= self._orderbook_max_age_seconds:
            return snapshot
        return await self.exchange.get_order_book(token_id)

    def _build_display_orderbook(
        self,
        token_id: str,
        primary_orderbook: OrderBookSnapshot,
        complement_orderbook: OrderBookSnapshot,
    ) -> OrderBookSnapshot:
        bids = self._merge_price_levels(
            primary_orderbook.bids,
            self._transform_complement_levels(complement_orderbook.asks),
            descending=True,
        )
        asks = self._merge_price_levels(
            primary_orderbook.asks,
            self._transform_complement_levels(complement_orderbook.bids),
            descending=False,
        )
        return OrderBookSnapshot(
            token_id=token_id,
            bids=bids,
            asks=asks,
            timestamp=max(primary_orderbook.timestamp, complement_orderbook.timestamp),
        )

    @staticmethod
    def _transform_complement_levels(levels: list[OrderBookLevel]) -> list[OrderBookLevel]:
        transformed: list[OrderBookLevel] = []
        for level in levels:
            price = round(float(np.clip(1.0 - level.price, 0.001, 0.999)), 4)
            size = float(level.size)
            if size <= 0:
                continue
            transformed.append(OrderBookLevel(price=price, size=size))
        return transformed

    @staticmethod
    def _merge_price_levels(
        primary_levels: list[OrderBookLevel],
        complement_levels: list[OrderBookLevel],
        descending: bool,
    ) -> list[OrderBookLevel]:
        aggregated: dict[float, float] = {}
        for level in list(primary_levels) + list(complement_levels):
            price = round(float(level.price), 4)
            size = float(level.size)
            if size <= 0:
                continue
            aggregated[price] = aggregated.get(price, 0.0) + size

        return [
            OrderBookLevel(price=price, size=round(aggregated[price], 4))
            for price in sorted(aggregated.keys(), reverse=descending)
        ]

    async def _refresh_reward_metadata(self, force: bool = False):
        if not self._reward_priority_enabled:
            return

        now = time.time()
        if (
            not force
            and self._last_reward_metadata_refresh > 0
            and now - self._last_reward_metadata_refresh < self._reward_metadata_refresh_seconds
        ):
            return

        try:
            await self.exchange.prefetch_market_metadata(list(self.markets.keys()))
            self._last_reward_metadata_refresh = now
        except Exception as exc:
            logger.warning("Reward metadata refresh failed: %s", exc)

    def _apply_reward_constraints(
        self,
        state: MarketState,
        orderbook: OrderBookSnapshot,
        quote: Quote,
        bid_size: float,
        ask_size: float,
        max_position: float,
    ) -> tuple[Quote, float, float]:
        state.reward_status = {}
        if not self._reward_priority_enabled:
            return quote, bid_size, ask_size

        # 逆向选择严重时不让 reward 约束压缩保护性价差
        metrics = self.metrics.get(state.token_id)
        if metrics and metrics.fill_count >= 5 and metrics.adverse_selection_ratio > 0.30:
            logger.debug(
                "[%s] Skipping reward constraints: adverse_selection=%.2f",
                state.market_name, metrics.adverse_selection_ratio,
            )
            return quote, bid_size, ask_size

        metadata = self.exchange.get_market_metadata(state.token_id)
        if metadata is None:
            return quote, bid_size, ask_size

        reward_min_size = max(metadata.rewards_min_size, metadata.order_min_size)
        reward_max_spread = metadata.rewards_max_spread
        tick_size = max(metadata.tick_size, 0.0001)

        state.reward_status = {
            "reward_active": bool(metadata.active and metadata.accepting_orders and reward_max_spread > 0),
            "reward_min_size": reward_min_size,
            "reward_max_spread": reward_max_spread,
            "tick_size": tick_size,
        }

        if not state.reward_status["reward_active"]:
            return quote, bid_size, ask_size

        reward_midpoint = self._reward_adjusted_midpoint(orderbook, reward_min_size)
        strict_cap = reward_max_spread
        if self._reward_strict_inside_max_spread and reward_max_spread > tick_size:
            strict_cap = reward_max_spread - tick_size

        min_bid = max(0.001, reward_midpoint - strict_cap)
        max_ask = min(0.999, reward_midpoint + strict_cap)
        bid_upper = self._quantize_probability(reward_midpoint, tick_size, "down")
        ask_lower = self._quantize_probability(reward_midpoint, tick_size, "up")
        bid_lower = self._quantize_probability(min_bid, tick_size, "up")
        ask_upper = self._quantize_probability(max_ask, tick_size, "down")

        if bid_upper < bid_lower:
            bid_upper = bid_lower
        if ask_lower > ask_upper:
            ask_lower = ask_upper

        bid_prob = float(np.clip(quote.bid_prob, bid_lower, bid_upper))
        ask_prob = float(np.clip(quote.ask_prob, ask_lower, ask_upper))
        bid_prob = self._quantize_probability(bid_prob, tick_size, "down")
        ask_prob = self._quantize_probability(ask_prob, tick_size, "up")

        bid_prob = float(np.clip(bid_prob, bid_lower, bid_upper))
        ask_prob = float(np.clip(ask_prob, ask_lower, ask_upper))

        if self._reward_enforce_min_size and reward_min_size > 0 and max_position >= reward_min_size:
            bid_size = max(bid_size, reward_min_size)
            ask_size = max(ask_size, reward_min_size)

        adjusted_quote = replace(
            quote,
            bid_prob=round(bid_prob, 4),
            ask_prob=round(ask_prob, 4),
            bid_logit=round(float(prob_to_logit(bid_prob)), 4),
            ask_logit=round(float(prob_to_logit(ask_prob)), 4),
            spread_prob=round(ask_prob - bid_prob, 4),
            spread_logit=round(float(prob_to_logit(ask_prob) - prob_to_logit(bid_prob)), 4),
        )

        effective_min_size = reward_min_size if reward_min_size > 0 else 0.0
        state.reward_status.update(
            {
                "reward_midpoint": reward_midpoint,
                "reward_effective_cap": strict_cap,
                "bid_reward_eligible": bool(
                    bid_size >= effective_min_size
                    and bid_lower - 1e-9 <= adjusted_quote.bid_prob <= bid_upper + 1e-9
                ),
                "ask_reward_eligible": bool(
                    ask_size >= effective_min_size
                    and ask_lower - 1e-9 <= adjusted_quote.ask_prob <= ask_upper + 1e-9
                ),
            }
        )
        return adjusted_quote, round(bid_size, 1), round(ask_size, 1)

    def _reward_adjusted_midpoint(self, orderbook: OrderBookSnapshot, min_size: float) -> float:
        if min_size <= 0:
            return orderbook.mid_price

        bid_price = self._price_at_depth(orderbook.bids, min_size)
        ask_price = self._price_at_depth(orderbook.asks, min_size)
        if bid_price is None or ask_price is None or ask_price <= bid_price:
            return orderbook.mid_price
        return float((bid_price + ask_price) / 2.0)

    @staticmethod
    def _price_at_depth(levels, target_size: float) -> float | None:
        cumulative = 0.0
        for level in levels:
            cumulative += level.size
            if cumulative >= target_size:
                return level.price
        return None

    def _apply_microstructure_guard(
        self,
        state: MarketState,
        orderbook: OrderBookSnapshot,
        quote: Quote,
        bid_size: float,
        ask_size: float,
    ) -> tuple[Quote, float, float, bool, bool]:
        now = time.time()
        state.microstructure_status = {
            "action": "none",
            "dangerous_side": "none",
            "dominant_side": "none",
            "depth_ratio": 0.0,
            "top_level_ratio": 0.0,
            "effective_ratio": 0.0,
            "trigger_source": "none",
            "bid_top_notional": 0.0,
            "ask_top_notional": 0.0,
            "bid_top1_notional": 0.0,
            "ask_top1_notional": 0.0,
            "spread_ticks": 0,
            "bid_enabled": True,
            "ask_enabled": True,
            "danger_duration_seconds": 0.0,
            "danger_observations": 0,
        }
        market_guard_override = self._get_market_override(state, "microstructure_guard_enabled", None)
        if market_guard_override is False:
            self._reset_micro_danger_state(state)
            state.microstructure_status["trigger_source"] = "market_override"
            return quote, round(bid_size, 1), round(ask_size, 1), True, True
        if not self._micro_guard_enabled:
            self._reset_micro_danger_state(state)
            return quote, round(bid_size, 1), round(ask_size, 1), True, True

        tick_size = self._get_tick_size(state)
        if tick_size <= 0:
            self._reset_micro_danger_state(state)
            return quote, round(bid_size, 1), round(ask_size, 1), True, True

        spread_ticks = int(round(max(orderbook.spread, 0.0) / tick_size))
        top_bid_notional = self._top_depth_notional(orderbook.bids, 1)
        top_ask_notional = self._top_depth_notional(orderbook.asks, 1)
        bid_notional = self._top_depth_notional(orderbook.bids, self._micro_guard_levels)
        ask_notional = self._top_depth_notional(orderbook.asks, self._micro_guard_levels)
        state.microstructure_status.update(
            {
                "bid_top1_notional": round(top_bid_notional, 2),
                "ask_top1_notional": round(top_ask_notional, 2),
                "bid_top_notional": round(bid_notional, 2),
                "ask_top_notional": round(ask_notional, 2),
                "spread_ticks": spread_ticks,
            }
        )

        if spread_ticks > self._micro_guard_max_spread_ticks:
            self._reset_micro_danger_state(state)
            return quote, round(bid_size, 1), round(ask_size, 1), True, True

        depth_ratio = self._depth_ratio(bid_notional, ask_notional, self._micro_guard_min_depth_notional)
        top_level_ratio = self._depth_ratio(
            top_bid_notional,
            top_ask_notional,
            self._micro_guard_top_level_min_depth_notional,
        )
        aggregate_dominant_side = "bid" if bid_notional >= ask_notional else "ask"
        top_level_dominant_side = "bid" if top_bid_notional >= top_ask_notional else "ask"
        bid_enabled = True
        ask_enabled = True
        adjusted_quote = quote
        adjusted_bid_size = float(bid_size)
        adjusted_ask_size = float(ask_size)
        action = "none"
        trigger_source = "none"
        effective_ratio = 0.0
        dominant_side = aggregate_dominant_side
        dangerous_side = "ask" if dominant_side == "bid" else "bid"

        triggers: list[tuple[int, float, float, str, str]] = []
        if depth_ratio >= self._micro_guard_disable_ratio:
            triggers.append(
                (
                    2,
                    depth_ratio / max(self._micro_guard_disable_ratio, 1.0),
                    depth_ratio,
                    aggregate_dominant_side,
                    "top3",
                )
            )
        if top_level_ratio >= self._micro_guard_top_level_disable_ratio:
            triggers.append(
                (
                    2,
                    top_level_ratio / max(self._micro_guard_top_level_disable_ratio, 1.0),
                    top_level_ratio,
                    top_level_dominant_side,
                    "top1",
                )
            )
        if depth_ratio >= self._micro_guard_retreat_ratio:
            triggers.append(
                (
                    1,
                    depth_ratio / max(self._micro_guard_retreat_ratio, 1.0),
                    depth_ratio,
                    aggregate_dominant_side,
                    "top3",
                )
            )
        if top_level_ratio >= self._micro_guard_top_level_retreat_ratio:
            triggers.append(
                (
                    1,
                    top_level_ratio / max(self._micro_guard_top_level_retreat_ratio, 1.0),
                    top_level_ratio,
                    top_level_dominant_side,
                    "top1",
                )
            )

        if triggers:
            priority, _, effective_ratio, dominant_side, trigger_source = max(
                triggers,
                key=lambda item: (item[0], item[1], item[2]),
            )
            dangerous_side = "ask" if dominant_side == "bid" else "bid"
            if priority == 2:
                action = "disable"
                if dangerous_side == "bid":
                    bid_enabled = False
                    adjusted_bid_size = 0.0
                else:
                    ask_enabled = False
                    adjusted_ask_size = 0.0
            else:
                action = "retreat"
                retreat_delta = self._micro_guard_retreat_ticks * tick_size
                if dangerous_side == "bid":
                    adjusted_quote = self._retreat_quote(adjusted_quote, bid_shift=-retreat_delta)
                    adjusted_bid_size *= self._micro_guard_retreat_size_factor
                else:
                    adjusted_quote = self._retreat_quote(adjusted_quote, ask_shift=retreat_delta)
                    adjusted_ask_size *= self._micro_guard_retreat_size_factor

        danger_duration_seconds, danger_observations = self._update_micro_danger_state(
            state,
            action=action,
            dangerous_side=dangerous_side,
            now=now,
        )
        if (
            action == "retreat"
            and dangerous_side in {"bid", "ask"}
            and danger_duration_seconds >= self._micro_guard_sustained_disable_seconds
            and danger_observations >= self._micro_guard_sustained_disable_min_observations
        ):
            action = "disable"
            trigger_source = f"{trigger_source}+sustain" if trigger_source != "none" else "sustain"
            logger.warning(
                "[%s] Sustained micro danger on %s side for %.1fs (%d obs), disabling side",
                state.market_name,
                dangerous_side,
                danger_duration_seconds,
                danger_observations,
            )
            if dangerous_side == "bid":
                bid_enabled = False
                adjusted_bid_size = 0.0
            else:
                ask_enabled = False
                adjusted_ask_size = 0.0

        adjusted_bid_size = round(max(adjusted_bid_size, 0.0), 1)
        adjusted_ask_size = round(max(adjusted_ask_size, 0.0), 1)
        state.microstructure_status.update(
            {
                "action": action,
                "dangerous_side": dangerous_side,
                "dominant_side": dominant_side,
                "depth_ratio": round(depth_ratio, 1) if np.isfinite(depth_ratio) else 9999.0,
                "top_level_ratio": round(top_level_ratio, 1) if np.isfinite(top_level_ratio) else 9999.0,
                "effective_ratio": round(effective_ratio, 1) if np.isfinite(effective_ratio) else 9999.0,
                "trigger_source": trigger_source,
                "bid_enabled": bid_enabled,
                "ask_enabled": ask_enabled,
                "danger_duration_seconds": round(danger_duration_seconds, 1),
                "danger_observations": int(danger_observations),
            }
        )

        self._refresh_reward_eligibility(
            state,
            adjusted_quote.bid_prob,
            adjusted_quote.ask_prob,
            adjusted_bid_size if bid_enabled else 0.0,
            adjusted_ask_size if ask_enabled else 0.0,
            bid_enabled,
            ask_enabled,
        )
        return adjusted_quote, adjusted_bid_size, adjusted_ask_size, bid_enabled, ask_enabled

    def _refresh_reward_eligibility(
        self,
        state: MarketState,
        bid_prob: float,
        ask_prob: float,
        bid_size: float,
        ask_size: float,
        bid_enabled: bool,
        ask_enabled: bool,
    ):
        if not state.reward_status:
            return

        reward_midpoint = state.reward_status.get("reward_midpoint")
        effective_cap = state.reward_status.get("reward_effective_cap")
        reward_min_size = float(state.reward_status.get("reward_min_size", 0.0))
        if reward_midpoint is None or effective_cap is None:
            state.reward_status["bid_reward_eligible"] = False
            state.reward_status["ask_reward_eligible"] = False
            return

        bid_lower = reward_midpoint - effective_cap
        bid_upper = reward_midpoint
        ask_lower = reward_midpoint
        ask_upper = reward_midpoint + effective_cap
        state.reward_status["bid_reward_eligible"] = bool(
            bid_enabled
            and bid_size >= reward_min_size
            and bid_lower - 1e-9 <= bid_prob <= bid_upper + 1e-9
        )
        state.reward_status["ask_reward_eligible"] = bool(
            ask_enabled
            and ask_size >= reward_min_size
            and ask_lower - 1e-9 <= ask_prob <= ask_upper + 1e-9
        )

    def _retreat_quote(self, quote: Quote, bid_shift: float = 0.0, ask_shift: float = 0.0) -> Quote:
        bid_prob = float(np.clip(quote.bid_prob + bid_shift, 0.001, 0.999))
        ask_prob = float(np.clip(quote.ask_prob + ask_shift, 0.001, 0.999))
        if ask_prob <= bid_prob:
            ask_prob = min(0.999, bid_prob + max(self._get_default_tick_size(), 0.0001))

        return replace(
            quote,
            bid_prob=round(bid_prob, 4),
            ask_prob=round(ask_prob, 4),
            bid_logit=round(float(prob_to_logit(bid_prob)), 4),
            ask_logit=round(float(prob_to_logit(ask_prob)), 4),
            spread_prob=round(ask_prob - bid_prob, 4),
            spread_logit=round(float(prob_to_logit(ask_prob) - prob_to_logit(bid_prob)), 4),
        )

    def _get_tick_size(self, state: MarketState) -> float:
        metadata = self.exchange.get_market_metadata(state.token_id)
        if metadata and metadata.tick_size > 0:
            return float(metadata.tick_size)
        reward_tick = state.reward_status.get("tick_size")
        if reward_tick:
            return float(reward_tick)
        return self._get_default_tick_size()

    def _get_default_tick_size(self) -> float:
        return 0.01

    @staticmethod
    def _depth_ratio(bid_notional: float, ask_notional: float, min_depth_notional: float) -> float:
        dominant_notional = max(bid_notional, ask_notional)
        weaker_notional = min(bid_notional, ask_notional)
        if dominant_notional < min_depth_notional:
            return 0.0
        if weaker_notional <= 0:
            return float("inf")
        return dominant_notional / weaker_notional

    @staticmethod
    def _top_depth_notional(levels: list, count: int) -> float:
        depth = 0.0
        for level in levels[:max(count, 1)]:
            depth += max(level.price, 0.0) * max(level.size, 0.0)
        return depth

    @staticmethod
    def _quantize_probability(value: float, tick_size: float, mode: str = "nearest") -> float:
        if tick_size <= 0:
            return round(value, 4)

        scaled = value / tick_size
        if mode == "up":
            steps = np.ceil(scaled - 1e-9)
        elif mode == "down":
            steps = np.floor(scaled + 1e-9)
        else:
            steps = np.round(scaled)

        quantized = float(steps * tick_size)
        quantized = min(max(quantized, tick_size), 1.0 - tick_size)
        return round(quantized, 4)

    async def _cancel_existing_orders(self, state: MarketState):
        if state.active_bid_id:
            cancelled = await self.exchange.cancel_order(state.active_bid_id)
            if cancelled:
                state.active_bid_id = ""
                state.active_bid_size = 0.0
                state.active_bid_price = 0.0
                state.active_bid_ts = 0.0
            else:
                logger.warning("[%s] Failed to cancel live bid %s; preserving local state", state.market_name, state.active_bid_id)
        if state.active_ask_id:
            cancelled = await self.exchange.cancel_order(state.active_ask_id)
            if cancelled:
                state.active_ask_id = ""
                state.active_ask_size = 0.0
                state.active_ask_price = 0.0
                state.active_ask_ts = 0.0
            else:
                logger.warning("[%s] Failed to cancel live ask %s; preserving local state", state.market_name, state.active_ask_id)

    def _on_orderbook_update(self, snapshot: OrderBookSnapshot):
        state = self.markets.get(snapshot.token_id)
        if state:
            state.prob = snapshot.mid_price
            return

        primary_token_id = self._complement_to_primary.get(snapshot.token_id, "")
        if not primary_token_id:
            return

        state = self.markets.get(primary_token_id)
        if state:
            state.prob = float(np.clip(1.0 - snapshot.mid_price, 0.001, 0.999))

    def _update_correlation_matrix(self):
        n = len(self.markets)
        if n < 2:
            self._correlation_matrix = np.eye(max(n, 1))
            return

        now = time.time()
        if (
            self._correlation_matrix is not None
            and now - self._last_correlation_update < self._correlation_update_interval
        ):
            return

        token_ids = list(self.markets.keys())
        returns_list = []
        min_len = 0
        has_data = False

        for token_id in token_ids:
            returns = self.logit.get_logit_returns(token_id, n=self._correlation_window)
            returns_list.append(returns)
            if len(returns) > 0:
                min_len = min(min_len, len(returns)) if has_data else len(returns)
                has_data = True

        min_required = max(10, self._min_contracts_for_correlation)
        if not has_data or min_len < min_required:
            self._correlation_matrix = np.eye(n)
            self._last_correlation_update = now
            return

        aligned = np.array([returns[-int(min_len):] for returns in returns_list])
        try:
            corr = np.corrcoef(aligned)
            corr = np.nan_to_num(corr, nan=0.0, posinf=1.0, neginf=-1.0)
            corr = np.clip(corr, -1.0, 1.0)
            np.fill_diagonal(corr, 1.0)
            self._correlation_matrix = corr
        except Exception:
            self._correlation_matrix = np.eye(n)

        self._last_correlation_update = now

    async def _refresh_account_balance(self, force: bool = False):
        if not self._balance_sizing_enabled:
            return

        now = time.time()
        if (
            not force
            and self._last_balance_refresh > 0
            and now - self._last_balance_refresh < self._balance_refresh_seconds
        ):
            return

        try:
            balance = float(await self.exchange.get_balance())
        except Exception as exc:
            logger.warning("Balance sizing refresh failed: %s", exc)
            return

        self._last_balance_refresh = now
        if balance <= 0:
            logger.warning("Balance sizing skipped because fetched balance is %.4f", balance)
            return

        previous_scale = self._balance_size_scale
        previous_effective_capital = self._effective_total_capital
        self._account_balance = balance

        raw_scale = balance / max(float(self._total_capital), 1.0)
        scale = float(np.clip(raw_scale, self._min_balance_size_scale, self._max_balance_size_scale))
        self._balance_size_scale = scale
        self._effective_total_capital = round(float(self._total_capital) * scale, 4)

        if (
            force
            or abs(previous_scale - self._balance_size_scale) >= 0.05
            or abs(previous_effective_capital - self._effective_total_capital) >= 100.0
        ):
            logger.info(
                "Balance sizing: balance=%.2f scale=%.2f effective_capital=%.2f reserve=%.2f",
                self._account_balance,
                self._balance_size_scale,
                self._effective_total_capital,
                self._reserve_ratio,
            )

    def _update_refresh_rate(self):
        if not self._adaptive_refresh_enabled:
            return
        now = time.time()
        cutoff = now - self._fast_refresh_window
        total_recent = 0
        for token_fills in self._recent_fills.values():
            total_recent += sum(1 for t, _ in token_fills if t >= cutoff)
        fill_rate = total_recent / max(self._fast_refresh_window, 0.1)
        previous = self._current_refresh_ms
        if fill_rate >= self._fast_refresh_fill_rate:
            self._current_refresh_ms = self._fast_refresh_ms
        else:
            self._current_refresh_ms = float(self._quote_refresh_ms)
        if previous != self._current_refresh_ms:
            logger.info(
                "Adaptive refresh: fill_rate=%.1f/s -> refresh=%dms",
                fill_rate, int(self._current_refresh_ms),
            )

    def _scale_by_balance(self, value: float, minimum: float = 0.0) -> float:
        if value <= 0:
            return 0.0
        scaled = float(value) * self._balance_size_scale if self._balance_sizing_enabled else float(value)
        return round(max(minimum, scaled), 1)

    def _build_sizing_plan(
        self,
        state: MarketState,
        mid_prob: float,
        effective_sigma: float,
        risk_state,
        tuning,
        book_imbalance: float,
        fill_imbalance: float,
    ) -> SizingPlan:
        # Centralize size planning so the main loop only coordinates quoting,
        # risk checks, and order management.
        max_position = self.risk_mgr.get_effective_position_limit(state.token_id, mid_prob, risk_state)
        max_position *= tuning.position_limit_multiplier
        balance_position_cap = 0.0
        if self._balance_sizing_enabled and self._balance_size_scale < 0.999:
            balance_position_cap = self._scale_by_balance(max_position, minimum=1.0)
            max_position = min(max_position, balance_position_cap)

        position_limit_floor = self._scale_by_balance(
            self._get_market_override(state, "position_limit_floor", 0.0)
        )
        if position_limit_floor > 0:
            max_position = max(max_position, position_limit_floor)

        position_limit_cap = self._get_market_override(state, "position_limit_cap", 0.0)
        if position_limit_cap > 0:
            max_position = min(max_position, position_limit_cap)
        if balance_position_cap > 0:
            max_position = min(max_position, balance_position_cap)

        market_count = max(len(self.markets), 1)
        capital_per_market = min(
            self._effective_total_capital * (1.0 - self._reserve_ratio) / market_count,
            self._max_per_market,
        )
        directional_pressure = float(np.clip(book_imbalance - fill_imbalance, -1.0, 1.0))
        bid_signal_strength = abs(fill_imbalance) + max(-directional_pressure, 0.0)
        ask_signal_strength = abs(fill_imbalance) + max(directional_pressure, 0.0)

        bid_size = self.quoting.compute_optimal_size(
            mid_prob,
            effective_sigma,
            max_position,
            state.inventory,
            capital_per_market=capital_per_market,
            n_markets=market_count,
            signal_strength=bid_signal_strength,
        )
        bid_size = self._apply_size_multiplier(
            bid_size,
            tuning.bid_size_multiplier,
            max_position,
        )
        bid_size = self._scale_by_balance(bid_size, minimum=1.0 if bid_size > 0 else 0.0)

        ask_size = self.quoting.compute_optimal_size(
            mid_prob,
            effective_sigma,
            max_position,
            -state.inventory,
            capital_per_market=capital_per_market,
            n_markets=market_count,
            signal_strength=ask_signal_strength,
        )
        ask_size = self._apply_size_multiplier(
            ask_size,
            tuning.ask_size_multiplier,
            max_position,
        )
        ask_size = self._scale_by_balance(ask_size, minimum=1.0 if ask_size > 0 else 0.0)

        return SizingPlan(
            max_position=max_position,
            capital_per_market=capital_per_market,
            market_count=market_count,
            bid_signal_strength=bid_signal_strength,
            ask_signal_strength=ask_signal_strength,
            bid_size=bid_size,
            ask_size=ask_size,
        )

    def _apply_two_sided_mode(
        self,
        state: MarketState,
        quote: Quote,
        bid_size: float,
        ask_size: float,
        n_markets: int,
    ) -> tuple[float, float]:
        # Keep both sides alive by shrinking the pair together when the requested
        # bid/ask notional would exceed the per-market capital budget.
        if not self._two_sided_mode_enabled:
            return round(bid_size, 1), round(ask_size, 1)

        if bid_size <= 0 or ask_size <= 0:
            return round(bid_size, 1), round(ask_size, 1)

        capital_basis = self._effective_total_capital
        if self._two_sided_use_account_balance and self._account_balance > 0:
            capital_basis = self._account_balance
        market_cap = min(
            max(capital_basis * (1.0 - self._reserve_ratio), 0.0) / max(n_markets, 1),
            self._max_per_market,
        )
        bid_cost_per_unit = max(min(quote.bid_prob, 1.0), 0.0)
        ask_cost_per_unit = max(min(1.0 - quote.ask_prob, 1.0), 0.0)
        bid_cost = bid_size * bid_cost_per_unit
        ask_cost = ask_size * ask_cost_per_unit
        total_pair_cost = bid_cost + ask_cost
        if market_cap <= 0 or total_pair_cost <= 0 or total_pair_cost <= market_cap:
            return round(bid_size, 1), round(ask_size, 1)

        # 按各自成本占比分配预算，而非等比缩放
        bid_ratio = bid_cost / total_pair_cost
        ask_ratio = ask_cost / total_pair_cost
        bid_budget = market_cap * bid_ratio
        ask_budget = market_cap * ask_ratio
        adjusted_bid_size = max(self._two_sided_min_size, bid_budget / max(bid_cost_per_unit, 0.001))
        adjusted_ask_size = max(self._two_sided_min_size, ask_budget / max(ask_cost_per_unit, 0.001))
        reward_min_size = float(state.reward_status.get("reward_min_size", 0.0) or 0.0)
        if reward_min_size > 0:
            state.reward_status["bid_reward_eligible"] = bool(
                state.reward_status.get("bid_reward_eligible", False)
                and adjusted_bid_size >= reward_min_size
            )
            state.reward_status["ask_reward_eligible"] = bool(
                state.reward_status.get("ask_reward_eligible", False)
                and adjusted_ask_size >= reward_min_size
            )
        logger.info(
            "[%s] Two-sided sizing cap market_cap=%.2f pair_cost=%.2f scale=%.2f -> bid=%.1f ask=%.1f",
            state.market_name,
            market_cap,
            total_pair_cost,
            scale,
            adjusted_bid_size,
            adjusted_ask_size,
        )
        return round(adjusted_bid_size, 1), round(adjusted_ask_size, 1)

    def _size_changed_materially(self, previous_size: float, new_size: float) -> bool:
        if previous_size <= 0:
            return True
        size_gap = abs(new_size - previous_size)
        threshold = max(
            self.quoting.min_order_size * 0.25,
            previous_size * self._size_update_threshold_ratio,
        )
        return size_gap >= threshold

    def _should_refresh_stale_order(
        self,
        state: MarketState,
        side_name: str,
        proposed_price: float,
        side_signal_strength: float,
        fill_imbalance: float,
        now: float,
    ) -> tuple[bool, dict]:
        info = {
            "age_seconds": 0.0,
            "same_tick": False,
            "adverse_drift_ticks": 0.0,
            "side_signal_strength": float(side_signal_strength),
            "fill_pressure": 0.0,
        }
        if not self._stale_guard_enabled:
            return False, info

        if side_name == "bid":
            active_id = state.active_bid_id
            active_price = state.active_bid_price
            active_ts = state.active_bid_ts
            fill_pressure = max(fill_imbalance, 0.0)
            adverse_drift = max(active_price - proposed_price, 0.0)
        else:
            active_id = state.active_ask_id
            active_price = state.active_ask_price
            active_ts = state.active_ask_ts
            fill_pressure = max(-fill_imbalance, 0.0)
            adverse_drift = max(proposed_price - active_price, 0.0)

        info["fill_pressure"] = float(fill_pressure)
        if not active_id or active_ts <= 0 or active_price <= 0:
            return False, info

        age_seconds = max(now - active_ts, 0.0)
        info["age_seconds"] = age_seconds
        if age_seconds < self._stale_guard_max_order_age_seconds:
            return False, info

        tick_size = max(self._get_tick_size(state), 0.0001)
        normalized_proposed = self._normalize_order_price(state, side_name, proposed_price)
        same_tick = abs(normalized_proposed - active_price) < 1e-9
        info["same_tick"] = same_tick
        info["adverse_drift_ticks"] = adverse_drift / tick_size
        if self._stale_guard_same_tick_only and not same_tick:
            return False, info

        signal_trigger = side_signal_strength >= self._stale_guard_min_side_signal_strength
        fill_trigger = fill_pressure >= self._stale_guard_min_fill_pressure
        drift_trigger = info["adverse_drift_ticks"] >= self._stale_guard_min_adverse_drift_ticks
        guard_trigger = (
            state.microstructure_status.get("dangerous_side") == side_name
            and state.microstructure_status.get("action") in {"retreat", "disable"}
        )
        dangerous_side = signal_trigger or fill_trigger or drift_trigger or guard_trigger
        if self._stale_guard_dangerous_side_only and not dangerous_side:
            return False, info
        return dangerous_side, info

    def _normalize_order_price(self, state: MarketState, side_name: str, price: float) -> float:
        tick_size = self._get_tick_size(state)
        mode = "down" if side_name == "bid" else "up"
        return round(self._quantize_probability(price, tick_size, mode), 4)

    def _price_changed_materially(self, state: MarketState, side_name: str, proposed_price: float) -> bool:
        active_price = state.active_bid_price if side_name == "bid" else state.active_ask_price
        if active_price <= 0:
            return True
        normalized_proposed = self._normalize_order_price(state, side_name, proposed_price)
        return abs(active_price - normalized_proposed) >= 1e-9

    @staticmethod
    def _reset_micro_danger_state(state: MarketState):
        state.micro_danger_side = "none"
        state.micro_danger_since_ts = 0.0
        state.micro_danger_observations = 0

    def _update_micro_danger_state(
        self,
        state: MarketState,
        action: str,
        dangerous_side: str,
        now: float,
    ) -> tuple[float, int]:
        if action in {"retreat", "disable"} and dangerous_side in {"bid", "ask"}:
            if state.micro_danger_side == dangerous_side and state.micro_danger_since_ts > 0:
                state.micro_danger_observations += 1
                duration = max(now - state.micro_danger_since_ts, 0.0)
            else:
                state.micro_danger_side = dangerous_side
                state.micro_danger_since_ts = now
                state.micro_danger_observations = 1
                duration = 0.0
            return duration, state.micro_danger_observations

        self._reset_micro_danger_state(state)
        return 0.0, 0

    def _apply_size_multiplier(self, base_size: float, multiplier: float, max_position: float) -> float:
        if max_position <= 0:
            return 0.0
        adaptive_floor = max(1.0, self.quoting.min_order_size * self._adaptive_min_size_ratio)
        adjusted = round(base_size * multiplier, 1)
        adjusted = max(adaptive_floor, adjusted)
        adjusted = min(max_position, adjusted)
        return round(max(adjusted, min(1.0, max_position)), 1)

    def _compute_book_imbalance(self, orderbook) -> float:
        levels = max(int(self._imbalance_levels), 1)
        bid_depth = sum(level.size for level in orderbook.bids[:levels])
        ask_depth = sum(level.size for level in orderbook.asks[:levels])
        total_depth = bid_depth + ask_depth
        if total_depth <= 0:
            return 0.0
        return float(np.clip((bid_depth - ask_depth) / total_depth, -1.0, 1.0))

    def _get_market_override(self, state: MarketState, key: str, default=0.0):
        candidates = [
            state.market_name,
            state.token_id,
        ]
        for candidate in candidates:
            override = self._market_overrides.get(candidate)
            if isinstance(override, dict) and key in override:
                return override[key]
        return default

    def _decay_fill_imbalance(self, state: MarketState, now: float) -> float:
        if state.last_flow_update_ts <= 0:
            state.last_flow_update_ts = now
            return state.fill_imbalance_ema

        elapsed = max(0.0, now - state.last_flow_update_ts)
        halflife = max(self._fill_bias_halflife_seconds, 1.0)
        decay = 0.5 ** (elapsed / halflife)
        state.fill_imbalance_ema *= decay
        state.last_flow_update_ts = now
        state.fill_imbalance_ema = float(np.clip(state.fill_imbalance_ema, -1.0, 1.0))
        return state.fill_imbalance_ema

    async def _sync_positions_from_exchange(self):
        try:
            positions = await self.exchange.get_positions()
        except Exception as exc:
            logger.warning("Failed to sync startup positions: %s", exc)
            return

        by_token = {position.token_id: position for position in positions}
        for token_id, state in self.markets.items():
            position = by_token.get(token_id)
            if position is None:
                state.inventory = 0.0
                state.avg_entry_price = 0.0
            else:
                state.inventory = float(position.size)
                state.avg_entry_price = float(np.clip(position.avg_price, 0.0001, 0.9999))
                logger.info(
                    "Startup position synced: %s inv=%.4f avg=%.4f",
                    state.market_name,
                    state.inventory,
                    state.avg_entry_price,
                )

            self.risk_mgr.update_position(
                token_id,
                state.inventory,
                state.avg_entry_price if state.avg_entry_price > 0 else state.prob,
                state.market_name,
                sigma_b=state.forecast_sigma,
                time_to_expiry=state.time_to_expiry,
            )

    def _extract_fill_id(self, data: dict) -> str:
        for key in ("trade_id", "tradeID", "match_id", "matchId", "matchID", "fill_id", "fillId", "id"):
            value = data.get(key)
            if value not in (None, ""):
                return f"{key}:{value}"

        asset_id = data.get("asset_id", data.get("token_id", ""))
        side = str(data.get("side", "")).upper()
        size = data.get("size", data.get("matchSize", data.get("filled_size", data.get("filledSize", ""))))
        price = data.get("price", data.get("matchPrice", data.get("filled_price", data.get("filledPrice", ""))))
        timestamp = data.get(
            "timestamp",
            data.get("time", data.get("created_at", data.get("createdAt", data.get("updated_at", data.get("updatedAt", ""))))),
        )
        maker_order_id = data.get("maker_order_id", data.get("makerOrderId", ""))
        taker_order_id = data.get("taker_order_id", data.get("takerOrderId", ""))
        return (
            f"composite:{asset_id}:{side}:{size}:{price}:{timestamp}:{maker_order_id}:{taker_order_id}:{data.get('event_type', '')}"
        )

    def _prune_seen_fills(self, now: float):
        cutoff = now - self._fill_dedupe_window_seconds
        stale_ids = [fill_id for fill_id, ts in self._seen_fill_ids.items() if ts < cutoff]
        for fill_id in stale_ids:
            self._seen_fill_ids.pop(fill_id, None)

    def _mark_fill_seen(self, fill_id: str, now: float) -> bool:
        if not fill_id:
            return False
        self._prune_seen_fills(now)
        if fill_id in self._seen_fill_ids:
            return True
        self._seen_fill_ids[fill_id] = now
        return False

    def _normalize_fill(self, token_id: str, side: str, price: float) -> tuple[str, str, float]:
        normalized_side = side.upper()
        normalized_price = float(np.clip(price, 0.0001, 0.9999))

        if token_id in self.markets:
            return token_id, normalized_side, normalized_price

        primary_token_id = self._complement_to_primary.get(token_id, "")
        if not primary_token_id:
            return token_id, normalized_side, normalized_price

        if normalized_side == "BUY":
            normalized_side = "SELL"
        elif normalized_side == "SELL":
            normalized_side = "BUY"

        normalized_price = float(np.clip(1.0 - normalized_price, 0.0001, 0.9999))
        return primary_token_id, normalized_side, normalized_price

    def _apply_fill_to_inventory(self, state: MarketState, side: str, size: float, price: float) -> float:
        signed_size = size if side == "BUY" else -size
        previous_inventory = state.inventory

        if previous_inventory == 0 or previous_inventory * signed_size > 0:
            new_inventory = previous_inventory + signed_size
            weighted_notional = (abs(previous_inventory) * state.avg_entry_price) + (size * price)
            state.inventory = new_inventory
            state.avg_entry_price = weighted_notional / abs(new_inventory) if abs(new_inventory) > 0 else 0.0
            return 0.0

        closing_size = min(abs(previous_inventory), abs(signed_size))
        if previous_inventory > 0:
            realized_pnl = closing_size * (price - state.avg_entry_price)
        else:
            realized_pnl = closing_size * (state.avg_entry_price - price)

        new_inventory = previous_inventory + signed_size
        state.inventory = new_inventory

        if new_inventory == 0:
            state.avg_entry_price = 0.0
        elif previous_inventory * new_inventory < 0:
            state.avg_entry_price = price

        return realized_pnl

    def _current_unrealized_pnl(self, state: MarketState) -> float:
        if state.inventory == 0:
            return 0.0
        return state.inventory * (state.prob - state.avg_entry_price)

    async def _on_fill_event(self, data: dict):
        try:
            asset_id = data.get("asset_id", data.get("token_id", ""))
            side = data.get("side", "").upper()
            size = float(data.get("size", data.get("matchSize", data.get("filled_size", data.get("filledSize", 0)))))
            price = float(data.get("price", data.get("matchPrice", data.get("filled_price", data.get("filledPrice", 0)))))
            if not asset_id or size <= 0 or side not in ("BUY", "SELL"):
                return

            fill_id = self._extract_fill_id(data)
            now = time.time()
            if self._mark_fill_seen(fill_id, now):
                logger.debug("Ignoring duplicate fill event %s", fill_id)
                return

            normalized_token_id, normalized_side, normalized_price = self._normalize_fill(asset_id, side, price)
            if normalized_token_id not in self.markets:
                logger.debug("Ignoring fill for untracked token %s (normalized from %s)", normalized_token_id[:12], asset_id[:12])
                return

            # 验证 fill 属于我们的订单: 检查 maker_order_id
            maker_order_id = data.get("maker_order_id", data.get("makerOrderId", ""))
            state = self.markets.get(normalized_token_id)
            if state and maker_order_id:
                our_orders = {state.active_bid_id, state.active_ask_id}
                if maker_order_id not in our_orders:
                    logger.debug(
                        "Ignoring fill for foreign order %s (ours: %s/%s)",
                        maker_order_id[:16], state.active_bid_id[:16] if state.active_bid_id else "-",
                        state.active_ask_id[:16] if state.active_ask_id else "-",
                    )
                    return

            # 额外安全: fill size 不应超过我们的挂单量 * 2 (容错)
            if state:
                max_expected = max(state.active_bid_size, state.active_ask_size, 1.0) * 2.0
                if size > max_expected:
                    logger.warning(
                        "[%s] Rejecting abnormal fill size=%.1f (max expected=%.1f)",
                        state.market_name, size, max_expected,
                    )
                    return

            self.on_fill(
                normalized_token_id,
                normalized_side,
                size,
                normalized_price,
                fill_id=fill_id,
                raw_token_id=asset_id,
                raw_side=side,
                raw_price=price,
            )
        except (ValueError, KeyError) as exc:
            logger.warning("Failed to parse fill event: %s - %s", data, exc)

    def on_fill(
        self,
        token_id: str,
        side: str,
        size: float,
        price: float,
        fill_id: str = "",
        raw_token_id: str = "",
        raw_side: str = "",
        raw_price: float = 0.0,
    ):
        state = self.markets.get(token_id)
        if not state:
            return

        now = time.time()
        # 记录冷却期时间戳
        self._last_fill_time[token_id] = now
        # 连续同向成交 burst 检测
        recent = self._recent_fills.setdefault(token_id, [])
        recent.append((now, side))
        cutoff = now - self._burst_window_seconds
        self._recent_fills[token_id] = [(t, s) for t, s in recent if t >= cutoff]
        same_side_count = sum(1 for _, s in self._recent_fills[token_id] if s == side)
        if same_side_count >= self._burst_max_same_side:
            pauses = self._burst_pause_until.setdefault(token_id, {})
            pauses[side] = now + self._burst_pause_seconds
            logger.warning(
                "[%s] Burst guard: %d %s fills in %.0fs, pausing %s side %.1fs",
                self.markets[token_id].market_name if token_id in self.markets else token_id[:12],
                same_side_count, side, self._burst_window_seconds, side, self._burst_pause_seconds,
            )
        # 更新 VPIN
        vpin_detector = self._vpin_detectors.get(token_id)
        if vpin_detector:
            vpin_detector.on_trade(side, size, now)

        self._decay_fill_imbalance(state, now)
        previous_inventory = state.inventory
        previous_avg_entry = state.avg_entry_price
        realized_pnl = self._apply_fill_to_inventory(state, side, size, price)

        signed_fill = size if side == "BUY" else -size
        state.fill_imbalance_ema += signed_fill / max(self._fill_signal_size_scale, self.quoting.min_order_size)
        state.fill_imbalance_ema = float(np.clip(state.fill_imbalance_ema, -1.0, 1.0))
        state.last_flow_update_ts = now

        mid = state.prob
        markout_pnl_per_unit = mid - price if side == "BUY" else price - mid
        markout_pnl = markout_pnl_per_unit * size

        metrics = self.metrics.get(token_id)
        if metrics:
            if previous_inventory == 0 and state.inventory != 0:
                metrics.inventory_open_ts = now
            elif previous_inventory != 0 and previous_inventory * state.inventory <= 0 and metrics.inventory_open_ts > 0:
                metrics.inventory_holding_hours_total += (now - metrics.inventory_open_ts) / 3600.0
                metrics.inventory_holding_samples += 1
                metrics.inventory_open_ts = now if state.inventory != 0 else 0.0

            metrics.fill_count += 1
            metrics.total_volume += size * price
            metrics.realized_pnl += realized_pnl
            metrics.markout_pnl += markout_pnl
            metrics.total_pnl = metrics.realized_pnl + self._current_unrealized_pnl(state)
            live_spread = max(state.active_ask_price - state.active_bid_price, 0.0)
            if live_spread > 0:
                metrics.gross_spread_income += size * live_spread / 2.0
            elif state.last_quote:
                metrics.gross_spread_income += size * state.last_quote.spread_prob / 2.0
            if markout_pnl < 0:
                metrics.adverse_selection_cost += abs(markout_pnl)

        self.risk_mgr.update_position(
            token_id,
            state.inventory,
            state.prob,
            state.market_name,
            sigma_b=state.forecast_sigma,
            time_to_expiry=state.time_to_expiry,
        )
        self.risk_mgr.record_pnl(markout_pnl, token_id=token_id)
        logger.info(
            "FILL: %s %s %.1f @ %.4f realized=%.4f markout=%.4f inv=%.1f avg=%.4f fill=%s raw=%s/%s@%.4f prev_inv=%.1f prev_avg=%.4f",
            state.market_name,
            side,
            size,
            price,
            realized_pnl,
            markout_pnl,
            state.inventory,
            state.avg_entry_price,
            fill_id or "-",
            raw_token_id[:12] if raw_token_id else token_id[:12],
            raw_side or side,
            raw_price or price,
            previous_inventory,
            previous_avg_entry,
        )

    def get_dashboard(self) -> dict:
        dashboard = {}
        portfolio = self._portfolio_snapshot or self.risk_mgr.get_portfolio_greeks(self._correlation_matrix)
        for token_id, state in self.markets.items():
            metrics = self.metrics.get(token_id)
            unrealized_pnl = self._current_unrealized_pnl(state)
            dashboard[state.market_name] = {
                "prob": state.prob,
                "sigma_b": state.sigma_b,
                "forecast_sigma": state.forecast_sigma,
                "regime": state.regime,
                "inventory": state.inventory,
                "avg_entry_price": state.avg_entry_price,
                "delta": state.greeks.delta if state.greeks else 0,
                "gamma": state.greeks.gamma if state.greeks else 0,
                "belief_vega": state.greeks.belief_vega if state.greeks else 0,
                "correlation_vega": state.greeks.correlation_vega if state.greeks else 0,
                "uncertainty_index": state.uncertainty_index,
                "bid": state.last_quote.bid_prob if state.last_quote else 0,
                "ask": state.last_quote.ask_prob if state.last_quote else 0,
                "spread": state.last_quote.spread_prob if state.last_quote else 0,
                "pnl": (metrics.realized_pnl if metrics else 0.0) + unrealized_pnl,
                "realized_pnl": metrics.realized_pnl if metrics else 0.0,
                "markout_pnl": metrics.markout_pnl if metrics else 0.0,
                "fill_count": metrics.fill_count if metrics else 0,
                "spread_capture": metrics.spread_capture_ratio if metrics else 0,
                "adverse_selection": metrics.adverse_selection_ratio if metrics else 0,
                "vol_forecast_rmse": metrics.vol_forecast_rmse if metrics else 0,
                "avg_inventory_holding_hours": metrics.avg_inventory_holding_hours if metrics else 0,
                "hedge_recommendations": state.hedge_recommendations,
                "tuning_decision": state.tuning_decision,
                "reward_status": state.reward_status,
                "microstructure_status": state.microstructure_status,
                "account_balance": self._account_balance,
                "balance_size_scale": self._balance_size_scale,
                "effective_total_capital": self._effective_total_capital,
                "portfolio_net_delta": portfolio.net_delta,
                "portfolio_gross_delta": portfolio.gross_delta,
                "portfolio_gross_gamma": portfolio.gross_gamma,
                "portfolio_belief_vega": portfolio.belief_vega,
                "portfolio_correlation_vega": portfolio.correlation_vega,
                "portfolio_market_vix": portfolio.market_vix,
            }
        return dashboard
