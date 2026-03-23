"""
Logit-Space Transformation Module
策略基石：所有量化分析在logit空间执行，概率空间建模在生产系统中被禁止。
"""
import numpy as np
from collections import deque
from dataclasses import dataclass

CLAMP_MIN = 0.0001
CLAMP_MAX = 0.9999


def clamp_prob(p: float | np.ndarray) -> float | np.ndarray:
    return np.clip(p, CLAMP_MIN, CLAMP_MAX)


def prob_to_logit(p: float | np.ndarray) -> float | np.ndarray:
    p = clamp_prob(p)
    return np.log(p / (1.0 - p))


def logit_to_prob(x: float | np.ndarray) -> float | np.ndarray:
    return 1.0 / (1.0 + np.exp(-x))


def logit_spread_to_prob_spread(mid_prob: float, half_spread_logit: float) -> tuple[float, float]:
    """将logit空间的对称spread映射回概率空间的非对称bid/ask"""
    mid_logit = prob_to_logit(mid_prob)
    bid_prob = logit_to_prob(mid_logit - half_spread_logit)
    ask_prob = logit_to_prob(mid_logit + half_spread_logit)
    return float(bid_prob), float(ask_prob)


@dataclass
class LogitState:
    """单个市场的logit空间状态"""
    token_id: str
    prob: float
    logit: float
    timestamp: float

    @classmethod
    def from_prob(cls, token_id: str, prob: float, timestamp: float) -> "LogitState":
        p = float(clamp_prob(prob))
        return cls(token_id=token_id, prob=p, logit=float(prob_to_logit(p)), timestamp=timestamp)


class LogitTransform:
    """Logit变换管理器：维护价格序列的logit映射"""

    MAX_HISTORY = 10000  # 每个token最大历史长度，防止内存泄漏

    def __init__(self, max_history: int = 10000):
        self._states: dict[str, deque[LogitState]] = {}
        self._max_history = max_history

    def update(self, token_id: str, prob: float, timestamp: float) -> LogitState:
        state = LogitState.from_prob(token_id, prob, timestamp)
        if token_id not in self._states:
            self._states[token_id] = deque(maxlen=self._max_history)
        self._states[token_id].append(state)
        return state

    def get_latest(self, token_id: str) -> LogitState | None:
        history = self._states.get(token_id)
        return history[-1] if history else None

    def get_logit_returns(self, token_id: str, n: int | None = None) -> np.ndarray:
        """计算logit空间的收益率序列(一阶差分)"""
        history = self._states.get(token_id, [])
        if len(history) < 2:
            return np.array([])
        logits = np.array([s.logit for s in history])
        if n is not None:
            logits = logits[-(n + 1):]
        return np.diff(logits)

    def get_logit_series(self, token_id: str, n: int | None = None) -> np.ndarray:
        history = self._states.get(token_id, [])
        if not history:
            return np.array([])
        logits = np.array([s.logit for s in history])
        return logits[-n:] if n else logits

    def get_timestamps(self, token_id: str, n: int | None = None) -> np.ndarray:
        history = self._states.get(token_id, [])
        if not history:
            return np.array([])
        ts = np.array([s.timestamp for s in history])
        return ts[-n:] if n else ts

    def clear(self, token_id: str | None = None):
        if token_id:
            self._states.pop(token_id, None)
        else:
            self._states.clear()
