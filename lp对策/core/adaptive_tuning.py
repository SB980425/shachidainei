"""
Adaptive quote tuning based on live market-making metrics.
"""
from dataclasses import asdict, dataclass, field


@dataclass
class AdaptiveTuningDecision:
    spread_multiplier: float = 1.0
    bid_size_multiplier: float = 1.0
    ask_size_multiplier: float = 1.0
    position_limit_multiplier: float = 1.0
    reasons: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        data = asdict(self)
        data["spread_multiplier"] = round(float(self.spread_multiplier), 4)
        data["bid_size_multiplier"] = round(float(self.bid_size_multiplier), 4)
        data["ask_size_multiplier"] = round(float(self.ask_size_multiplier), 4)
        data["position_limit_multiplier"] = round(float(self.position_limit_multiplier), 4)
        return data


class AdaptiveTuningEngine:
    def __init__(self, config: dict):
        cfg = config.get("adaptive_tuning", {})
        metrics_cfg = config.get("metrics", {})
        risk_cfg = config.get("risk_limits", {})

        self.enabled = cfg.get("enabled", True)
        self.min_fills_for_performance = cfg.get("min_fills_for_performance", 15)
        self.min_forecast_samples = cfg.get("min_forecast_samples", 20)
        self.min_holding_samples = cfg.get("min_holding_samples", 1)

        self.capture_target = metrics_cfg.get("spread_capture_target", 0.60)
        self.capture_alert = metrics_cfg.get("spread_capture_alert", 0.40)
        self.adverse_target = metrics_cfg.get("adverse_selection_max", 0.30)
        self.adverse_alert = metrics_cfg.get("adverse_selection_alert", 0.50)
        self.rmse_alert = metrics_cfg.get("vol_forecast_rmse_max", 0.15)
        self.holding_alert_hours = risk_cfg.get("inventory_turnover_alert_hours", 12.0)

        self.uncertainty_high = cfg.get("uncertainty_high", 0.23)
        self.gamma_threshold = cfg.get("gamma_threshold", 0.04)
        self.belief_vega_threshold = cfg.get("belief_vega_threshold", 50.0)
        self.correlation_vega_threshold = cfg.get("correlation_vega_threshold", 75.0)

        self.tighten_spread_factor = cfg.get("tighten_spread_factor", 0.94)
        self.boost_size_factor = cfg.get("boost_size_factor", 1.12)
        self.widen_spread_factor = cfg.get("widen_spread_factor", 1.12)
        self.cut_size_factor = cfg.get("cut_size_factor", 0.78)
        self.adverse_widen_factor = cfg.get("adverse_widen_factor", 1.20)
        self.adverse_size_factor = cfg.get("adverse_size_factor", 0.70)
        self.uncertainty_spread_factor = cfg.get("uncertainty_spread_factor", 1.10)
        self.uncertainty_size_factor = cfg.get("uncertainty_size_factor", 0.90)
        self.gamma_spread_factor = cfg.get("gamma_spread_factor", 1.05)
        self.gamma_vulnerable_side_factor = cfg.get("gamma_vulnerable_side_factor", 0.82)
        self.vega_spread_factor = cfg.get("vega_spread_factor", 1.08)
        self.vega_size_factor = cfg.get("vega_size_factor", 0.85)
        self.correlation_spread_factor = cfg.get("correlation_spread_factor", 1.08)
        self.correlation_size_factor = cfg.get("correlation_size_factor", 0.85)
        self.holding_spread_factor = cfg.get("holding_spread_factor", 1.06)
        self.inventory_exit_factor = cfg.get("inventory_exit_factor", 0.60)
        self.inventory_relief_factor = cfg.get("inventory_relief_factor", 1.05)
        self.rmse_spread_factor = cfg.get("rmse_spread_factor", 1.08)
        self.rmse_size_factor = cfg.get("rmse_size_factor", 0.90)

        self.min_spread_multiplier = cfg.get("min_spread_multiplier", 0.85)
        self.max_spread_multiplier = cfg.get("max_spread_multiplier", 1.60)
        self.min_size_multiplier = cfg.get("min_size_multiplier", 0.50)
        self.max_size_multiplier = cfg.get("max_size_multiplier", 1.30)
        self.min_position_limit_multiplier = cfg.get("min_position_limit_multiplier", 0.60)
        self.max_position_limit_multiplier = cfg.get("max_position_limit_multiplier", 1.20)

    def decide(self, state, metrics, portfolio_greeks) -> AdaptiveTuningDecision:
        decision = AdaptiveTuningDecision()
        if not self.enabled:
            return decision

        uncertainty_index = getattr(state, "uncertainty_index", 0.0)
        gamma = abs(getattr(state.greeks, "gamma", 0.0)) if getattr(state, "greeks", None) else 0.0
        belief_vega = abs(getattr(state.greeks, "belief_vega", 0.0)) if getattr(state, "greeks", None) else 0.0
        correlation_vega = abs(getattr(portfolio_greeks, "correlation_vega", 0.0))

        if metrics and metrics.fill_count >= self.min_fills_for_performance:
            if metrics.spread_capture_ratio >= self.capture_target and metrics.adverse_selection_ratio <= self.adverse_target:
                decision.spread_multiplier *= self.tighten_spread_factor
                decision.bid_size_multiplier *= self.boost_size_factor
                decision.ask_size_multiplier *= self.boost_size_factor
                decision.reasons.append("strong spread capture")
            elif metrics.spread_capture_ratio < self.capture_alert:
                decision.spread_multiplier *= self.widen_spread_factor
                decision.bid_size_multiplier *= self.cut_size_factor
                decision.ask_size_multiplier *= self.cut_size_factor
                decision.reasons.append("weak spread capture")

            if metrics.adverse_selection_ratio > self.adverse_alert:
                decision.spread_multiplier *= self.adverse_widen_factor
                decision.bid_size_multiplier *= self.adverse_size_factor
                decision.ask_size_multiplier *= self.adverse_size_factor
                decision.position_limit_multiplier *= 0.85
                decision.reasons.append("high adverse selection")

        if uncertainty_index >= self.uncertainty_high:
            decision.spread_multiplier *= self.uncertainty_spread_factor
            decision.bid_size_multiplier *= self.uncertainty_size_factor
            decision.ask_size_multiplier *= self.uncertainty_size_factor
            decision.position_limit_multiplier *= 0.90
            decision.reasons.append("swing-zone uncertainty")

        if gamma >= self.gamma_threshold:
            decision.spread_multiplier *= self.gamma_spread_factor
            if getattr(state.greeks, "gamma", 0.0) < 0:
                decision.bid_size_multiplier *= self.gamma_vulnerable_side_factor
                decision.reasons.append("negative gamma, cut bid")
            else:
                decision.ask_size_multiplier *= self.gamma_vulnerable_side_factor
                decision.reasons.append("positive gamma, cut ask")

        if belief_vega >= self.belief_vega_threshold:
            decision.spread_multiplier *= self.vega_spread_factor
            decision.bid_size_multiplier *= self.vega_size_factor
            decision.ask_size_multiplier *= self.vega_size_factor
            decision.position_limit_multiplier *= 0.90
            decision.reasons.append("short volatility exposure")

        if correlation_vega >= self.correlation_vega_threshold:
            decision.spread_multiplier *= self.correlation_spread_factor
            decision.bid_size_multiplier *= self.correlation_size_factor
            decision.ask_size_multiplier *= self.correlation_size_factor
            decision.position_limit_multiplier *= 0.85
            decision.reasons.append("portfolio correlation risk")

        if (
            metrics
            and metrics.inventory_holding_samples >= self.min_holding_samples
            and metrics.avg_inventory_holding_hours > self.holding_alert_hours
            and abs(getattr(state, "inventory", 0.0)) > 0
        ):
            decision.spread_multiplier *= self.holding_spread_factor
            if state.inventory > 0:
                decision.bid_size_multiplier *= self.inventory_exit_factor
                decision.ask_size_multiplier *= self.inventory_relief_factor
                decision.reasons.append("long inventory aging")
            else:
                decision.ask_size_multiplier *= self.inventory_exit_factor
                decision.bid_size_multiplier *= self.inventory_relief_factor
                decision.reasons.append("short inventory aging")

        if metrics and metrics.forecast_count >= self.min_forecast_samples and metrics.vol_forecast_rmse > self.rmse_alert:
            decision.spread_multiplier *= self.rmse_spread_factor
            decision.bid_size_multiplier *= self.rmse_size_factor
            decision.ask_size_multiplier *= self.rmse_size_factor
            decision.reasons.append("forecast error elevated")

        decision.spread_multiplier = self._clamp(
            decision.spread_multiplier,
            self.min_spread_multiplier,
            self.max_spread_multiplier,
        )
        decision.bid_size_multiplier = self._clamp(
            decision.bid_size_multiplier,
            self.min_size_multiplier,
            self.max_size_multiplier,
        )
        decision.ask_size_multiplier = self._clamp(
            decision.ask_size_multiplier,
            self.min_size_multiplier,
            self.max_size_multiplier,
        )
        decision.position_limit_multiplier = self._clamp(
            decision.position_limit_multiplier,
            self.min_position_limit_multiplier,
            self.max_position_limit_multiplier,
        )
        return decision

    @staticmethod
    def _clamp(value: float, min_value: float, max_value: float) -> float:
        return max(min_value, min(max_value, float(value)))
