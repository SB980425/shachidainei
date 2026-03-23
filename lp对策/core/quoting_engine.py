"""
Dynamic quoting engine in logit space.
"""
from dataclasses import dataclass

import numpy as np

from .greeks import PredictionMarketGreeks
from .logit import clamp_prob, logit_to_prob, prob_to_logit


@dataclass
class Quote:
    bid_prob: float
    ask_prob: float
    bid_logit: float
    ask_logit: float
    mid_prob: float
    mid_logit: float
    spread_prob: float
    spread_logit: float
    inventory_skew_logit: float
    depth_skew_logit: float = 0.0
    fill_skew_logit: float = 0.0


class QuotingEngine:
    def __init__(self, config: dict):
        qc = config.get("quoting", {})
        uncertainty_cfg = config.get("uncertainty", {})
        self.gamma = qc.get("risk_aversion", 0.1)
        self.base_spread_logit = qc.get("base_spread_logit", 0.5)
        self.min_spread_prob = qc.get("min_spread_prob", 0.002)
        self.min_spread_prob_swing = qc.get("min_spread_prob_swing", 0.005)
        self.max_spread_prob = qc.get("max_spread_prob", 0.15)
        self.quote_refresh_ms = qc.get("quote_refresh_ms", 500)
        self.min_order_size = qc.get("min_order_size", 200.0)

        self.depth_signal_weight = qc.get("depth_signal_weight", 0.12)
        self.fill_signal_weight = qc.get("fill_signal_weight", 0.18)
        self.signal_spread_multiplier = qc.get("signal_spread_multiplier", 0.35)
        self.signal_size_dampen = qc.get("signal_size_dampen", 0.30)
        self.gamma_asymmetry_weight = qc.get("gamma_asymmetry_weight", 0.25)
        self.min_uncertainty_scale = uncertainty_cfg.get("min_spread_scale", 0.20)

    def compute_quote(
        self,
        mid_prob: float,
        sigma_b: float,
        inventory: float,
        time_to_expiry: float,
        spread_multiplier: float = 1.0,
        book_imbalance: float = 0.0,
        fill_imbalance: float = 0.0,
    ) -> Quote:
        mid_prob = float(clamp_prob(mid_prob))
        mid_logit = float(prob_to_logit(mid_prob))
        book_imbalance = float(np.clip(book_imbalance, -1.0, 1.0))
        fill_imbalance = float(np.clip(fill_imbalance, -1.0, 1.0))

        uncertainty_scale = PredictionMarketGreeks.spread_scaling_factor(
            mid_prob,
            floor=self.min_uncertainty_scale,
        )
        # sigma_b 直接缩放 base_spread，无需除2（二元期权 σ_b 已是 logit 空间量）
        vol_adjusted_spread = self.base_spread_logit * max(sigma_b / 2.5, 0.4)
        effective_ttx = min(time_to_expiry, 60.0)
        time_factor = np.sqrt(max(effective_ttx, 0.01) / 30.0)
        time_adjusted_spread = vol_adjusted_spread * time_factor * uncertainty_scale

        signal_strength = min(1.0, 0.5 * (abs(book_imbalance) + abs(fill_imbalance)))
        informational_spread = 1.0 + self.signal_spread_multiplier * signal_strength
        final_spread = time_adjusted_spread * spread_multiplier * informational_spread
        half_spread = final_spread / 2.0

        sigma_instant = sigma_b / np.sqrt(252)
        # 到期越近风险越高: 使用 1/sqrt(TTX) 衰减因子，TTX→0 时偏移增大
        urgency = 1.0 / np.sqrt(max(effective_ttx, 0.1))
        inventory_skew = self.gamma * (sigma_instant ** 2) * inventory * urgency

        depth_skew = self.depth_signal_weight * book_imbalance
        fill_skew = -self.fill_signal_weight * fill_imbalance
        reservation_shift = depth_skew + fill_skew

        bid_logit = mid_logit - half_spread - inventory_skew + reservation_shift
        ask_logit = mid_logit + half_spread - inventory_skew + reservation_shift

        bid_prob = float(logit_to_prob(bid_logit))
        ask_prob = float(logit_to_prob(ask_logit))

        gamma_val = PredictionMarketGreeks.gamma(mid_prob)
        if abs(gamma_val) > 0.01:
            gamma_adjust = self.gamma_asymmetry_weight * abs(gamma_val)
            # gamma > 0 (p < 0.5): 价格上涨风险大，加宽ask保护
            # gamma < 0 (p > 0.5): 价格下跌风险大，加宽bid保护
            if gamma_val > 0:
                ask_logit += gamma_adjust
            else:
                bid_logit -= gamma_adjust
            bid_prob = float(logit_to_prob(bid_logit))
            ask_prob = float(logit_to_prob(ask_logit))

        spread_prob = ask_prob - bid_prob
        # swing zone (0.35-0.65) gamma 最大，用更宽的最低价差
        effective_min_spread = self.min_spread_prob
        if 0.35 <= mid_prob <= 0.65:
            effective_min_spread = self.min_spread_prob_swing
        if spread_prob < effective_min_spread:
            deficit = (effective_min_spread - spread_prob) / 2.0
            bid_prob = max(0.001, bid_prob - deficit)
            ask_prob = min(0.999, ask_prob + deficit)
        elif spread_prob > self.max_spread_prob:
            excess = (spread_prob - self.max_spread_prob) / 2.0
            bid_prob += excess
            ask_prob -= excess

        spread_prob = ask_prob - bid_prob
        bid_logit = float(prob_to_logit(bid_prob))
        ask_logit = float(prob_to_logit(ask_prob))
        spread_logit = ask_logit - bid_logit

        return Quote(
            bid_prob=round(bid_prob, 4),
            ask_prob=round(ask_prob, 4),
            bid_logit=round(bid_logit, 4),
            ask_logit=round(ask_logit, 4),
            mid_prob=round(mid_prob, 4),
            mid_logit=round(mid_logit, 4),
            spread_prob=round(spread_prob, 4),
            spread_logit=round(spread_logit, 4),
            inventory_skew_logit=round(inventory_skew, 6),
            depth_skew_logit=round(depth_skew, 6),
            fill_skew_logit=round(fill_skew, 6),
        )

    def compute_optimal_size(
        self,
        prob: float,
        sigma_b: float,
        max_position: float,
        current_inventory: float,
        capital_per_market: float = 0.0,
        n_markets: int = 1,
        signal_strength: float = 0.0,
    ) -> float:
        del n_markets
        signal_strength = float(np.clip(signal_strength, 0.0, 2.0))

        if capital_per_market > 0 and prob > 0.01:
            cost_per_share = prob
            # 二元市场互补: /1.5 而非 /2.0, 因为 YES+NO 不会同时亏损
            capital_per_side = capital_per_market / 1.5
            capital_based_size = capital_per_side / max(cost_per_share, 0.05)
        else:
            capital_based_size = self.min_order_size

        delta = PredictionMarketGreeks.delta(prob)
        delta_factor = 1.0 - (delta / 0.25) * 0.5
        vol_factor = min(1.0, 2.0 / max(sigma_b, 0.5))
        inv_ratio = abs(current_inventory) / max(max_position, 1.0)
        inv_factor = max(0.1, 1.0 - inv_ratio)
        flow_factor = max(0.35, 1.0 - self.signal_size_dampen * signal_strength)

        risk_factor = max(0.35, delta_factor * vol_factor * inv_factor * flow_factor)
        optimal = capital_based_size * risk_factor
        optimal = min(optimal, max_position)

        return max(self.min_order_size, round(optimal, 1))
