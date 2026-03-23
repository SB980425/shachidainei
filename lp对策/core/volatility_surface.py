"""
Belief Volatility Surface Construction
σ_b(time_to_expiry, probability_level) — 策略的战略雷达
将被动风险管理转化为前瞻性风险管理
"""
import numpy as np
from collections import deque
from dataclasses import dataclass
import time as _time


@dataclass
class VolSurfacePoint:
    time_bucket: float   # 到期天数
    prob_bucket: float   # 概率水平
    sigma_b: float       # 估计的信念波动率
    sample_count: int    # 样本数
    last_updated: float  # 时间戳


class VolatilitySurface:
    """
    信念波动率曲面: 类似期权隐含波动率曲面
    维度1: time-to-expiry
    维度2: probability level
    """

    def __init__(self, config: dict):
        vs_cfg = config.get("vol_surface", {})
        self.time_buckets = np.array(vs_cfg.get("time_buckets", [0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0]))
        self.prob_buckets = np.array(vs_cfg.get("prob_buckets", [0.02, 0.05, 0.15, 0.30, 0.50, 0.70, 0.85, 0.95, 0.98]))
        self.lookback_hours = vs_cfg.get("lookback_window", 168)
        self.update_interval = vs_cfg.get("update_interval", 3600)

        nt = len(self.time_buckets)
        np_ = len(self.prob_buckets)
        self._surface = np.full((nt, np_), 2.0)  # 默认normal regime
        self._counts = np.zeros((nt, np_), dtype=int)
        self._last_update = 0.0

        # 历史数据存储: deque按时间有序, 左端最旧
        self._history: deque[tuple[float, float, float, float]] = deque()
        self._cleanup_counter = 0

    def add_observation(self, timestamp: float, time_to_expiry: float,
                        prob: float, logit_return: float):
        self._history.append((timestamp, time_to_expiry, prob, logit_return))
        # 每100次观测清理一次过期数据(O(k)淘汰左端过期项, 而非O(n)全量过滤)
        self._cleanup_counter += 1
        if self._cleanup_counter >= 100:
            self._cleanup_counter = 0
            cutoff = timestamp - self.lookback_hours * 3600
            while self._history and self._history[0][0] <= cutoff:
                self._history.popleft()

    def rebuild(self, current_time: float | None = None):
        """重建波动率曲面"""
        if current_time is None:
            current_time = _time.time()

        nt = len(self.time_buckets)
        np_ = len(self.prob_buckets)
        self._surface = np.full((nt, np_), 2.0)
        self._counts = np.zeros((nt, np_), dtype=int)

        if not self._history:
            self._last_update = current_time
            return

        data = np.array(list(self._history))
        timestamps = data[:, 0]
        ttes = data[:, 1]
        probs = data[:, 2]
        returns = data[:, 3]

        cutoff = current_time - self.lookback_hours * 3600
        mask = timestamps > cutoff

        if not np.any(mask):
            self._last_update = current_time
            return

        ttes = ttes[mask]
        probs = probs[mask]
        returns = returns[mask]

        for i, tb in enumerate(self.time_buckets):
            for j, pb in enumerate(self.prob_buckets):
                # 找最近的bucket
                tb_low = self.time_buckets[i - 1] if i > 0 else 0.0
                tb_high = self.time_buckets[i + 1] if i < len(self.time_buckets) - 1 else 999.0
                tb_mask = (ttes >= (tb + tb_low) / 2) & (ttes < (tb + tb_high) / 2)

                pb_low = self.prob_buckets[j - 1] if j > 0 else 0.0
                pb_high = self.prob_buckets[j + 1] if j < len(self.prob_buckets) - 1 else 1.0
                pb_mask = (probs >= (pb + pb_low) / 2) & (probs < (pb + pb_high) / 2)

                combined = tb_mask & pb_mask
                if np.sum(combined) >= 5:
                    bucket_returns = returns[combined]
                    # 年化波动率
                    self._surface[i, j] = float(np.std(bucket_returns) * np.sqrt(252))
                    self._counts[i, j] = int(np.sum(combined))

        self._last_update = current_time

    def query(self, time_to_expiry: float, prob: float) -> float:
        """查询特定(time_to_expiry, prob)的σ_b，双线性插值"""
        # 找最近的bucket索引
        ti = np.searchsorted(self.time_buckets, time_to_expiry)
        ti = np.clip(ti, 0, len(self.time_buckets) - 1)

        pi = np.searchsorted(self.prob_buckets, prob)
        pi = np.clip(pi, 0, len(self.prob_buckets) - 1)

        # 简单最近邻(数据不足时), 数据充足时可升级为双线性插值
        if self._counts[ti, pi] >= 5:
            return float(self._surface[ti, pi])

        # 回退: 在该time bucket中取均值
        row = self._surface[ti, :]
        valid = self._counts[ti, :] >= 5
        if np.any(valid):
            return float(np.mean(row[valid]))

        # 全局回退
        valid_all = self._counts >= 5
        if np.any(valid_all):
            return float(np.mean(self._surface[valid_all]))

        return 2.0  # 默认normal regime

    def get_surface_matrix(self) -> np.ndarray:
        return self._surface.copy()

    def needs_update(self, current_time: float | None = None) -> bool:
        if current_time is None:
            current_time = _time.time()
        return (current_time - self._last_update) > self.update_interval
