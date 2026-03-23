"""
VPIN (Volume-Synchronized Probability of Informed Trading) 毒性流量检测。
高 VPIN → 信息不对称严重 → 应撤单或加宽 spread。
"""
import numpy as np
from collections import deque
from dataclasses import dataclass


@dataclass
class ToxicityState:
    vpin: float = 0.0
    is_toxic: bool = False
    spread_multiplier: float = 1.0
    should_withdraw: bool = False


class VPINDetector:
    def __init__(self, config: dict):
        cfg = config.get("toxicity", {})
        self.bucket_volume = cfg.get("bucket_volume", 500.0)
        self.n_buckets = cfg.get("n_buckets", 50)
        self.toxic_threshold = cfg.get("toxic_threshold", 0.70)
        self.withdraw_threshold = cfg.get("withdraw_threshold", 0.85)
        self.spread_scale_factor = cfg.get("spread_scale_factor", 2.0)
        self.cooldown_seconds = cfg.get("cooldown_seconds", 5.0)

        self._buy_volume_accum = 0.0
        self._sell_volume_accum = 0.0
        self._total_volume_accum = 0.0
        self._buckets: deque[tuple[float, float]] = deque(maxlen=self.n_buckets)
        self._last_toxic_time = 0.0

    def on_trade(self, side: str, size: float, timestamp: float):
        """每次成交调用。side: 'BUY' 或 'SELL'"""
        if side == "BUY":
            self._buy_volume_accum += size
        else:
            self._sell_volume_accum += size
        self._total_volume_accum += size

        while self._total_volume_accum >= self.bucket_volume:
            ratio = self.bucket_volume / self._total_volume_accum
            bucket_buy = self._buy_volume_accum * ratio
            bucket_sell = self._sell_volume_accum * ratio
            self._buckets.append((bucket_buy, bucket_sell))

            self._buy_volume_accum -= bucket_buy
            self._sell_volume_accum -= bucket_sell
            self._total_volume_accum -= self.bucket_volume

    def evaluate(self, timestamp: float) -> ToxicityState:
        """计算当前 VPIN 并返回毒性状态"""
        if len(self._buckets) < 5:
            return ToxicityState()

        order_imbalances = [abs(b - s) for b, s in self._buckets]
        vpin = float(np.mean(order_imbalances) / self.bucket_volume)
        vpin = min(vpin, 1.0)

        is_toxic = vpin >= self.toxic_threshold
        should_withdraw = vpin >= self.withdraw_threshold

        if is_toxic:
            self._last_toxic_time = timestamp

        spread_mult = 1.0
        if is_toxic:
            excess = (vpin - self.toxic_threshold) / (1.0 - self.toxic_threshold)
            spread_mult = 1.0 + self.spread_scale_factor * excess

        return ToxicityState(
            vpin=round(vpin, 4),
            is_toxic=is_toxic,
            spread_multiplier=round(spread_mult, 4),
            should_withdraw=should_withdraw,
        )

    def in_cooldown(self, timestamp: float) -> bool:
        """成交后是否仍在冷却期"""
        return (timestamp - self._last_toxic_time) < self.cooldown_seconds

    def reset(self):
        self._buy_volume_accum = 0.0
        self._sell_volume_accum = 0.0
        self._total_volume_accum = 0.0
        self._buckets.clear()
        self._last_toxic_time = 0.0
