"""
Polymarket 互补仓位对冲引擎。
在 Polymarket 上唯一可执行的对冲方式：
1. YES/NO 互补对冲（同一市场）
2. 跨市场相关性对冲（相关市场反向开仓）
3. 库存削减（主动减仓）
"""
from dataclasses import asdict, dataclass
from enum import Enum

import numpy as np


class HedgeType(Enum):
    COMPLEMENT_HEDGE = "complement_hedge"       # YES/NO 互补对冲
    CROSS_MARKET_HEDGE = "cross_market_hedge"   # 跨市场相关性对冲
    INVENTORY_REDUCE = "inventory_reduce"       # 主动减仓


@dataclass
class HedgeRecommendation:
    hedge_type: str
    market_name: str
    rationale: str
    trigger_metric: float
    action_side: str            # BUY or SELL
    action_token_id: str        # 执行对冲的 token
    suggested_size: float
    urgency: float              # 0-1, 越高越紧急
    parameters: dict

    def to_dict(self) -> dict:
        data = asdict(self)
        data["trigger_metric"] = round(float(self.trigger_metric), 4)
        data["suggested_size"] = round(float(self.suggested_size), 1)
        data["urgency"] = round(float(self.urgency), 4)
        return data


class HedgeEngine:
    def __init__(self, config: dict):
        cfg = config.get("hedging", {})
        self.inventory_hedge_threshold = cfg.get("inventory_hedge_threshold", 0.6)
        self.complement_hedge_ratio = cfg.get("complement_hedge_ratio", 0.5)
        self.cross_market_correlation_threshold = cfg.get("cross_market_correlation_threshold", 0.7)
        self.max_hedge_size_ratio = cfg.get("max_hedge_size_ratio", 0.3)
        self.urgency_inventory_threshold = cfg.get("urgency_inventory_threshold", 0.8)

    def recommend(
        self,
        market_name: str,
        token_id: str,
        no_token_id: str,
        prob: float,
        inventory: float,
        max_position: float,
        sigma_b: float,
        time_to_expiry: float,
        all_inventories: list[float] | None = None,
        all_probs: list[float] | None = None,
        all_token_ids: list[str] | None = None,
        correlation_matrix: np.ndarray | None = None,
    ) -> list[HedgeRecommendation]:
        recs: list[HedgeRecommendation] = []

        if max_position <= 0:
            return recs

        inv_ratio = abs(inventory) / max_position

        # 1. 互补仓位对冲: 库存过高时买入反方向 token
        if inv_ratio >= self.inventory_hedge_threshold and no_token_id:
            hedge_size = abs(inventory) * self.complement_hedge_ratio
            urgency = min(1.0, inv_ratio / self.urgency_inventory_threshold)
            # 到期越近，对冲越紧急
            if time_to_expiry < 3.0:
                urgency = min(1.0, urgency * 1.5)

            if inventory > 0:
                action_side = "BUY"
                action_token = no_token_id
                rationale = f"多头库存 {inventory:.0f} 超阈值，买入 NO token 对冲"
            else:
                action_side = "BUY"
                action_token = token_id
                rationale = f"空头库存 {inventory:.0f} 超阈值，买入 YES token 对冲"

            recs.append(HedgeRecommendation(
                hedge_type=HedgeType.COMPLEMENT_HEDGE.value,
                market_name=market_name,
                rationale=rationale,
                trigger_metric=inv_ratio,
                action_side=action_side,
                action_token_id=action_token,
                suggested_size=round(hedge_size, 1),
                urgency=urgency,
                parameters={"inventory": inventory, "max_position": max_position,
                            "time_to_expiry": time_to_expiry},
            ))

        # 2. 跨市场相关性对冲
        if (
            correlation_matrix is not None
            and all_inventories is not None
            and all_token_ids is not None
            and all_probs is not None
            and inv_ratio >= 0.4
        ):
            n = min(len(all_inventories), correlation_matrix.shape[0])
            my_idx = None
            for i, tid in enumerate(all_token_ids[:n]):
                if tid == token_id:
                    my_idx = i
                    break

            if my_idx is not None:
                for j in range(n):
                    if j == my_idx:
                        continue
                    corr = float(correlation_matrix[my_idx, j])
                    if abs(corr) < self.cross_market_correlation_threshold:
                        continue

                    other_inv = all_inventories[j]
                    # 高正相关 + 同向持仓 → 风险集中
                    if corr > 0 and inventory * other_inv > 0:
                        hedge_size = min(abs(inventory), abs(other_inv)) * self.max_hedge_size_ratio
                        recs.append(HedgeRecommendation(
                            hedge_type=HedgeType.CROSS_MARKET_HEDGE.value,
                            market_name=market_name,
                            rationale=f"与市场 {all_token_ids[j][:8]} 相关性 {corr:.2f}，同向持仓集中",
                            trigger_metric=abs(corr),
                            action_side="SELL" if inventory > 0 else "BUY",
                            action_token_id=token_id,
                            suggested_size=round(hedge_size, 1),
                            urgency=min(1.0, abs(corr) * inv_ratio),
                            parameters={"correlation": corr, "other_inventory": other_inv},
                        ))

        # 3. 主动减仓: 极端库存 + 高波动
        if inv_ratio >= 0.9 and sigma_b > 3.0:
            reduce_size = abs(inventory) * 0.3
            recs.append(HedgeRecommendation(
                hedge_type=HedgeType.INVENTORY_REDUCE.value,
                market_name=market_name,
                rationale=f"极端库存 {inv_ratio:.0%} + 高波动 σ={sigma_b:.1f}，建议主动减仓",
                trigger_metric=inv_ratio * sigma_b,
                action_side="SELL" if inventory > 0 else "BUY",
                action_token_id=token_id,
                suggested_size=round(reduce_size, 1),
                urgency=min(1.0, inv_ratio * sigma_b / 10.0),
                parameters={"sigma_b": sigma_b, "inventory_ratio": inv_ratio},
            ))

        return recs
