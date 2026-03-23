"""
Prediction market Greeks and portfolio risk aggregation.
"""
from dataclasses import dataclass

import numpy as np


@dataclass
class Greeks:
    delta: float
    gamma: float
    belief_vega: float
    correlation_vega: float
    uncertainty_index: float


@dataclass
class PortfolioGreeks:
    net_delta: float
    gross_delta: float
    net_gamma: float
    gross_gamma: float
    belief_vega: float
    correlation_vega: float
    market_vix: float


class PredictionMarketGreeks:
    @staticmethod
    def delta(p: float) -> float:
        p = np.clip(p, 0.001, 0.999)
        return float(p * (1.0 - p))

    @staticmethod
    def gamma(p: float) -> float:
        p = np.clip(p, 0.001, 0.999)
        return float(p * (1.0 - p) * (1.0 - 2.0 * p))

    @staticmethod
    def uncertainty_index(p: float) -> float:
        return PredictionMarketGreeks.delta(p)

    @staticmethod
    def spread_scaling_factor(p: float, floor: float = 0.15) -> float:
        # 极端概率处信息不对称最强，spread 必须更宽
        # p*(1-p) 在 p=0.5 时最大(0.25)，极端时趋近0
        # 反转: 极端概率 → scale 大; 中间概率 → scale=1.0
        uncertainty = float(np.clip(p, 0.001, 0.999)) * (1.0 - float(np.clip(p, 0.001, 0.999)))
        # 基础scale=1.0 在p=0.5; 在极端概率处(p<0.1或p>0.9)放大到 ~2.5x
        base_scale = uncertainty / 0.25  # [0, 1.0]
        # 极端概率惩罚: 越极端spread越宽
        extreme_penalty = 1.0 + 1.5 * (1.0 - base_scale) ** 2
        return float(max(floor, extreme_penalty))

    @staticmethod
    def belief_vega(inventory: float, p: float, sigma_b: float, time_to_expiry: float) -> float:
        delta = PredictionMarketGreeks.delta(p)
        annual_time = max(time_to_expiry, 0.0) / 365.0
        return float(-abs(inventory) * delta * sigma_b * max(np.sqrt(annual_time), 1e-4))

    @staticmethod
    def correlation_vega(
        inventories: list[float],
        probs: list[float],
        correlation_matrix: np.ndarray,
    ) -> float:
        n = len(inventories)
        if n < 2 or correlation_matrix.shape[0] < n or correlation_matrix.shape[1] < n:
            return 0.0

        corr = np.nan_to_num(correlation_matrix[:n, :n], nan=0.0, posinf=1.0, neginf=-1.0)
        np.fill_diagonal(corr, 1.0)
        deltas = np.array([PredictionMarketGreeks.delta(prob) for prob in probs[:n]])
        weighted = np.array(inventories[:n]) * deltas
        base_var = float(weighted @ corr @ weighted)

        bumped = corr.copy()
        mask = ~np.eye(n, dtype=bool)
        bumped[mask] = np.clip(bumped[mask] + 0.01, -1.0, 1.0)
        bumped_var = float(weighted @ bumped @ weighted)
        value = float((bumped_var - base_var) / 0.01)
        return value if np.isfinite(value) else 0.0

    @classmethod
    def compute_all(
        cls,
        p: float,
        inventory: float,
        sigma_b: float,
        time_to_expiry: float,
        inventories: list[float] | None = None,
        probs: list[float] | None = None,
        correlation_matrix: np.ndarray | None = None,
    ) -> Greeks:
        delta = cls.delta(p)
        gamma = cls.gamma(p)
        belief_vega = cls.belief_vega(inventory, p, sigma_b, time_to_expiry)
        correlation_vega = 0.0
        if inventories is not None and probs is not None and correlation_matrix is not None:
            correlation_vega = cls.correlation_vega(inventories, probs, correlation_matrix)

        return Greeks(
            delta=delta,
            gamma=gamma,
            belief_vega=belief_vega,
            correlation_vega=correlation_vega,
            uncertainty_index=delta,
        )

    @classmethod
    def aggregate_portfolio(
        cls,
        inventories: list[float],
        probs: list[float],
        sigma_bs: list[float] | None = None,
        time_to_expiries: list[float] | None = None,
        correlation_matrix: np.ndarray | None = None,
    ) -> PortfolioGreeks:
        n = min(len(inventories), len(probs))
        if n == 0:
            return PortfolioGreeks(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)

        inv = np.array(inventories[:n], dtype=float)
        pr = np.array(probs[:n], dtype=float)
        delta_vec = np.array([cls.delta(prob) for prob in pr], dtype=float)
        gamma_vec = np.array([cls.gamma(prob) for prob in pr], dtype=float)

        net_delta = float(np.sum(inv * delta_vec))
        gross_delta = float(np.sum(np.abs(inv * delta_vec)))
        net_gamma = float(np.sum(inv * gamma_vec))
        gross_gamma = float(np.sum(np.abs(inv * gamma_vec)))

        belief_vega = 0.0
        if sigma_bs is not None and time_to_expiries is not None:
            for inventory, prob, sigma_b, ttx in zip(inv, pr, sigma_bs[:n], time_to_expiries[:n]):
                belief_vega += cls.belief_vega(float(inventory), float(prob), float(sigma_b), float(ttx))

        correlation_vega = 0.0
        if correlation_matrix is not None and correlation_matrix.size > 0:
            correlation_vega = cls.correlation_vega(inv.tolist(), pr.tolist(), correlation_matrix)

        market_vix = float(np.mean([cls.uncertainty_index(prob) for prob in pr]))
        return PortfolioGreeks(
            net_delta=net_delta,
            gross_delta=gross_delta,
            net_gamma=net_gamma,
            gross_gamma=gross_gamma,
            belief_vega=float(belief_vega),
            correlation_vega=float(correlation_vega),
            market_vix=market_vix,
        )

    @staticmethod
    def risk_zone(p: float) -> str:
        distance = abs(float(np.clip(p, 0.0, 1.0)) - 0.5)
        if distance >= 0.40:
            return "deep_certainty"
        if distance >= 0.15:
            return "moderate"
        return "swing"

    @staticmethod
    def position_limit_multiplier(p: float) -> float:
        zone = PredictionMarketGreeks.risk_zone(p)
        return {"deep_certainty": 1.5, "moderate": 1.0, "swing": 0.625}[zone]
