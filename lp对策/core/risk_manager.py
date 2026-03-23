"""
Risk manager for limits, circuit breakers, and portfolio analytics.
"""
import logging
import time as _time
from datetime import datetime, timezone
from dataclasses import dataclass
from enum import Enum

import numpy as np

from .greeks import PortfolioGreeks, PredictionMarketGreeks

logger = logging.getLogger(__name__)


class RiskAction(Enum):
    NORMAL = "normal"
    WIDEN_SPREADS = "widen_spreads"
    REDUCE_POSITION = "reduce_position"
    PAUSE_QUOTING = "pause_quoting"
    FULL_WITHDRAWAL = "full_withdrawal"


@dataclass
class RiskState:
    action: RiskAction
    reason: str
    spread_multiplier: float = 1.0
    position_limit_multiplier: float = 1.0
    pause_until: float = 0.0


@dataclass
class PortfolioPosition:
    token_id: str
    inventory: float
    prob: float
    market_name: str = ""
    sigma_b: float = 2.0
    time_to_expiry: float = 30.0


class RiskManager:
    def __init__(self, config: dict):
        rl = config.get("risk_limits", {})
        cap = config.get("capital", {})
        event_cfg = config.get("event_risk", {})

        self.enabled = rl.get("enabled", True)
        self.max_single_inventory = rl.get("max_single_inventory", 500)
        self.portfolio_delta_limit = rl.get("portfolio_delta_limit", 50.0)
        self.correlation_cluster_max = rl.get("correlation_cluster_max", 0.40)
        self.crisis_spread_mult = rl.get("crisis_spread_multiplier", 3.0)
        self.jump_pause_seconds = rl.get("jump_pause_seconds", 60)
        self.max_daily_loss_pct = rl.get("max_daily_loss_pct", 0.03)
        self.max_drawdown_per_event = rl.get("max_drawdown_per_event", 0.02)
        self.inventory_turnover_alert_hours = rl.get("inventory_turnover_alert_hours", 12)

        self.total_capital = cap.get("total_allocated", 10000.0)
        self.max_per_market = cap.get("max_per_market", 2000.0)
        self.reserve_ratio = cap.get("reserve_ratio", 0.20)

        self.pre_event_horizon_days = event_cfg.get("pre_event_horizon_days", 14.0)
        self.forecast_sigma_ratio_trigger = event_cfg.get("forecast_sigma_ratio_trigger", 1.2)
        self.forecast_sigma_floor = event_cfg.get("forecast_sigma_floor", 2.5)
        self.pre_event_spread_multiplier = event_cfg.get("pre_event_spread_multiplier", 1.5)
        self.pre_event_position_limit_multiplier = event_cfg.get("pre_event_position_limit_multiplier", 0.8)

        self._daily_pnl = 0.0
        self._day_start_equity = self.total_capital
        self._pause_until = 0.0
        self._positions: dict[str, PortfolioPosition] = {}
        self._pnl_history: list[tuple[float, float]] = []
        self._market_pnl: dict[str, float] = {}
        self._daily_reset_day = self._day_bucket()

    def update_position(
        self,
        token_id: str,
        inventory: float,
        prob: float,
        market_name: str = "",
        sigma_b: float = 2.0,
        time_to_expiry: float = 30.0,
    ):
        self._positions[token_id] = PortfolioPosition(
            token_id=token_id,
            inventory=inventory,
            prob=prob,
            market_name=market_name,
            sigma_b=sigma_b,
            time_to_expiry=time_to_expiry,
        )

    def record_pnl(self, pnl: float, token_id: str | None = None, timestamp: float | None = None):
        if timestamp is None:
            timestamp = _time.time()
        self._daily_pnl += pnl
        self._pnl_history.append((timestamp, pnl))
        if token_id:
            self._market_pnl[token_id] = self._market_pnl.get(token_id, 0.0) + pnl

    def reset_daily(self, equity: float, timestamp: float | None = None):
        if timestamp is None:
            timestamp = _time.time()
        self._daily_pnl = 0.0
        self._day_start_equity = equity
        self._pnl_history.clear()
        self._market_pnl.clear()
        self._daily_reset_day = self._day_bucket(timestamp)

    def maybe_reset_daily(self, equity: float, timestamp: float | None = None) -> bool:
        if timestamp is None:
            timestamp = _time.time()
        current_day = self._day_bucket(timestamp)
        if current_day == self._daily_reset_day:
            return False

        logger.info(
            "Resetting daily risk counters for %s with start equity %.2f",
            current_day.isoformat(),
            equity,
        )
        self.reset_daily(equity, timestamp=timestamp)
        return True

    def check_risk(
        self,
        regime: str,
        jump_detected: bool,
        correlation_matrix: np.ndarray | None = None,
        token_id: str = "",
        sigma_b: float = 0.0,
        forecast_sigma: float = 0.0,
        time_to_expiry: float = 30.0,
    ) -> RiskState:
        if not self.enabled:
            return RiskState(action=RiskAction.NORMAL, reason="risk disabled")

        now = _time.time()

        if now < self._pause_until:
            return RiskState(
                action=RiskAction.PAUSE_QUOTING,
                reason=f"quoting paused until {self._pause_until:.0f}",
                pause_until=self._pause_until,
            )

        if jump_detected:
            self._pause_until = now + self.jump_pause_seconds
            logger.warning("Jump detected, pausing quoting for %ds", self.jump_pause_seconds)
            return RiskState(
                action=RiskAction.PAUSE_QUOTING,
                reason="jump detected",
                pause_until=self._pause_until,
            )

        daily_loss_pct = -self._daily_pnl / self._day_start_equity if self._day_start_equity > 0 else 0.0
        if daily_loss_pct > self.max_daily_loss_pct:
            logger.critical(
                "Max daily loss breached: %.2f%% > %.2f%%",
                daily_loss_pct * 100,
                self.max_daily_loss_pct * 100,
            )
            return RiskState(
                action=RiskAction.FULL_WITHDRAWAL,
                reason=f"daily loss {daily_loss_pct:.2%} > limit {self.max_daily_loss_pct:.2%}",
            )

        market_drawdown = -self._market_pnl.get(token_id, 0.0) / self.total_capital if self.total_capital > 0 else 0.0
        if token_id and market_drawdown > self.max_drawdown_per_event:
            return RiskState(
                action=RiskAction.REDUCE_POSITION,
                reason=f"event drawdown {market_drawdown:.2%} > {self.max_drawdown_per_event:.2%}",
                position_limit_multiplier=0.5,
            )

        if regime == "crisis":
            logger.warning("Crisis regime, widening spreads and minimizing positions")
            return RiskState(
                action=RiskAction.WIDEN_SPREADS,
                reason="crisis volatility regime",
                spread_multiplier=self.crisis_spread_mult,
                position_limit_multiplier=0.1,
            )

        event_spread_mult, event_pos_mult, event_reason = self._event_risk_adjustment(
            sigma_b=sigma_b,
            forecast_sigma=forecast_sigma,
            time_to_expiry=time_to_expiry,
        )
        if event_reason:
            return RiskState(
                action=RiskAction.WIDEN_SPREADS,
                reason=event_reason,
                spread_multiplier=event_spread_mult,
                position_limit_multiplier=event_pos_mult,
            )

        portfolio_delta = self._calc_portfolio_delta()
        if portfolio_delta > self.portfolio_delta_limit:
            logger.warning(
                "Portfolio delta %.2f > limit %.2f",
                portfolio_delta,
                self.portfolio_delta_limit,
            )
            return RiskState(
                action=RiskAction.REDUCE_POSITION,
                reason=f"portfolio delta {portfolio_delta:.2f} > {self.portfolio_delta_limit:.2f}",
                position_limit_multiplier=0.5,
            )

        if correlation_matrix is not None and len(self._positions) >= 3:
            cluster_risk = self._check_correlation_concentration(correlation_matrix)
            if cluster_risk > self.correlation_cluster_max:
                logger.warning(
                    "Correlation cluster %.2f > limit %.2f",
                    cluster_risk,
                    self.correlation_cluster_max,
                )
                return RiskState(
                    action=RiskAction.REDUCE_POSITION,
                    reason=f"correlation concentration {cluster_risk:.2%}",
                    position_limit_multiplier=0.7,
                )

        if regime == "high":
            return RiskState(
                action=RiskAction.WIDEN_SPREADS,
                reason="high volatility regime",
                spread_multiplier=1.5,
                position_limit_multiplier=0.5,
            )

        return RiskState(action=RiskAction.NORMAL, reason="all clear")

    def check_order_allowed(
        self,
        token_id: str,
        side: str,
        size: float,
        prob: float,
        position_limit_override: float | None = None,
    ) -> tuple[bool, str]:
        if not self.enabled:
            return True, "risk disabled"

        pos = self._positions.get(token_id)
        current_inv = pos.inventory if pos else 0.0
        new_inv = current_inv + size if side == "BUY" else current_inv - size

        position_limit = position_limit_override
        if position_limit is None:
            position_limit = self.max_single_inventory * PredictionMarketGreeks.position_limit_multiplier(prob)
        if abs(new_inv) > position_limit:
            return False, f"inventory {new_inv:.1f} exceeds limit {position_limit:.1f}"

        # 成本加权限仓: 新仓位的总成本不得超过单市场资本上限
        new_cost = self._estimate_inventory_cost(new_inv, prob)
        if new_cost > self.max_per_market:
            return False, f"position cost {new_cost:.2f} exceeds per-market capital {self.max_per_market:.2f}"

        order_cost = self._estimate_order_cost(side, size, prob)
        if order_cost > self.max_per_market:
            return False, f"order cost {order_cost:.2f} exceeds per-market limit {self.max_per_market:.2f}"

        available = self.total_capital * (1.0 - self.reserve_ratio)
        total_deployed = sum(
            self._estimate_inventory_cost(position.inventory, position.prob)
            for position in self._positions.values()
        )
        if total_deployed + order_cost > available:
            return (
                False,
                f"insufficient capital: deployed {total_deployed:.2f} + {order_cost:.2f} > {available:.2f}",
            )

        return True, "ok"

    def get_portfolio_greeks(self, correlation_matrix: np.ndarray | None = None) -> PortfolioGreeks:
        positions = list(self._positions.values())
        inventories = [position.inventory for position in positions]
        probs = [position.prob for position in positions]
        sigmas = [position.sigma_b for position in positions]
        ttxs = [position.time_to_expiry for position in positions]
        return PredictionMarketGreeks.aggregate_portfolio(
            inventories=inventories,
            probs=probs,
            sigma_bs=sigmas,
            time_to_expiries=ttxs,
            correlation_matrix=correlation_matrix,
        )

    def get_uncertainty_risk(self, token_id: str) -> float:
        position = self._positions.get(token_id)
        if not position:
            return 0.0
        return abs(position.inventory) * PredictionMarketGreeks.uncertainty_index(position.prob)

    def _calc_portfolio_delta(self) -> float:
        return sum(
            abs(position.inventory) * PredictionMarketGreeks.delta(position.prob)
            for position in self._positions.values()
        )

    def _check_correlation_concentration(self, corr_matrix: np.ndarray) -> float:
        positions = list(self._positions.values())
        n = min(len(positions), corr_matrix.shape[0], corr_matrix.shape[1])
        if n < 2:
            return 0.0

        deltas = np.array([PredictionMarketGreeks.delta(position.prob) for position in positions[:n]])
        weighted = np.array([position.inventory for position in positions[:n]]) * deltas
        portfolio_var = float(weighted @ corr_matrix[:n, :n] @ weighted)
        if portfolio_var < 1e-10:
            return 0.0

        total_risk = np.sqrt(portfolio_var)
        cov_weighted = corr_matrix[:n, :n] @ weighted
        marginal_contributions = weighted * cov_weighted / total_risk
        return float(np.max(np.abs(marginal_contributions))) / total_risk

    def get_effective_position_limit(self, token_id: str, prob: float, risk_state: RiskState) -> float:
        del token_id
        if not self.enabled:
            return self.max_single_inventory
        base = self.max_single_inventory
        zone_mult = PredictionMarketGreeks.position_limit_multiplier(prob)
        risk_mult = risk_state.position_limit_multiplier
        return base * zone_mult * risk_mult

    def _event_risk_adjustment(self, sigma_b: float, forecast_sigma: float, time_to_expiry: float) -> tuple[float, float, str]:
        if time_to_expiry > self.pre_event_horizon_days:
            return 1.0, 1.0, ""

        if forecast_sigma >= self.forecast_sigma_floor and forecast_sigma >= max(sigma_b, 1e-6) * self.forecast_sigma_ratio_trigger:
            return (
                self.pre_event_spread_multiplier,
                self.pre_event_position_limit_multiplier,
                "pre-event volatility forecast elevated",
            )

        return 1.0, 1.0, ""

    def _estimate_order_cost(self, side: str, size: float, prob: float) -> float:
        unit_cost = prob if side == "BUY" else (1.0 - prob)
        return size * max(min(unit_cost, 1.0), 0.0)

    def _estimate_inventory_cost(self, inventory: float, prob: float) -> float:
        if inventory >= 0:
            return inventory * prob
        return abs(inventory) * (1.0 - prob)

    @staticmethod
    def _day_bucket(timestamp: float | None = None):
        if timestamp is None:
            timestamp = _time.time()
        return datetime.fromtimestamp(timestamp, tz=timezone.utc).date()
