"""
Calibration Pipeline: Kalman Filter + EM Jump-Diffusion Separation
Stage 1: Kalman滤波 — 从噪声价格提取隐含信念状态
Stage 2: EM算法 — 分离扩散与跳跃成分
"""
import numpy as np
from dataclasses import dataclass, field


@dataclass
class KalmanState:
    x: float          # 状态估计 (logit belief)
    P: float          # 估计方差
    K: float = 0.0    # Kalman增益
    innovation: float = 0.0  # 新息


@dataclass
class JumpDiffusionParams:
    sigma_b: float       # 扩散波动率 (annualized logit)
    lambda_j: float      # 跳跃频率 (per day)
    mu_j: float          # 跳跃均值 (logit units)
    sigma_j: float       # 跳跃标准差 (logit units)
    log_likelihood: float = 0.0


@dataclass
class CalibrationResult:
    kalman_state: KalmanState
    jd_params: JumpDiffusionParams
    regime: str          # low / normal / high / crisis
    jump_detected: bool
    innovations: np.ndarray = field(default_factory=lambda: np.array([]))


class KalmanFilter:
    """自适应Kalman滤波器 — 流动性自适应增益"""

    def __init__(self, process_noise: float = 0.01, measurement_noise: float = 0.05,
                 initial_variance: float = 1.0):
        self.Q = process_noise
        self.R_base = measurement_noise
        self.state: KalmanState | None = None
        self.initial_P = initial_variance
        self.innovations: list[float] = []

    def init_state(self, x0: float):
        self.state = KalmanState(x=x0, P=self.initial_P)
        self.innovations.clear()

    def update(self, observation: float, spread: float = 0.0) -> KalmanState:
        """
        spread: 当前bid-ask spread (logit) — 用于自适应观测噪声
        高流动性(tight spread) → 信任观测; 低流动性(wide spread) → 信任模型
        """
        if self.state is None:
            self.init_state(observation)
            return self.state

        # 自适应观测噪声: spread越大，观测噪声越大
        R = self.R_base * (1.0 + 2.0 * abs(spread))

        # Predict
        x_pred = self.state.x
        P_pred = self.state.P + self.Q

        # Update
        innovation = observation - x_pred
        S = P_pred + R
        K = P_pred / S
        x_new = x_pred + K * innovation
        P_new = (1.0 - K) * P_pred

        self.state = KalmanState(x=x_new, P=P_new, K=K, innovation=innovation)
        self.innovations.append(innovation)
        return self.state

    def get_innovations(self, n: int | None = None) -> np.ndarray:
        arr = np.array(self.innovations)
        return arr[-n:] if n else arr


class EMJumpDiffusion:
    """
    EM算法: 将滤波后的logit新息分解为扩散和跳跃成分
    防止单个大跳跃污染扩散波动率估计
    """

    def __init__(self, max_iter: int = 50, tol: float = 1e-6,
                 jump_threshold_sigma: float = 2.5, min_diffusion_frac: float = 0.5):
        self.max_iter = max_iter
        self.tol = tol
        self.jump_threshold = jump_threshold_sigma
        self.min_diff_frac = min_diffusion_frac

    def fit(self, innovations: np.ndarray, dt: float = 1.0) -> JumpDiffusionParams:
        """
        innovations: Kalman新息序列
        dt: 时间步长 (天)
        返回: 分离后的JumpDiffusion参数
        """
        n = len(innovations)
        if n < 10:
            sigma_raw = float(np.std(innovations)) if n > 1 else 0.5
            sigma_annual = sigma_raw / np.sqrt(max(dt, 1e-4)) * np.sqrt(252)
            return JumpDiffusionParams(
                sigma_b=float(np.clip(sigma_annual, 0.5, 20.0)),
                lambda_j=0.5, mu_j=0.0, sigma_j=sigma_raw * 2.0
            )

        # 初始化: 粗略分离
        std_all = np.std(innovations)
        sigma_d = std_all * 0.7
        lambda_j = 0.1
        mu_j = 0.0
        sigma_j = std_all * 2.0

        log_lik_prev = -np.inf

        for iteration in range(self.max_iter):
            # E-step: 计算每个新息属于跳跃的后验概率
            var_d = sigma_d ** 2
            var_j = sigma_d ** 2 + sigma_j ** 2
            jump_prob = float(np.clip(lambda_j * dt, 1e-6, 1.0 - 1e-6))

            log_p_diff = -0.5 * np.log(2 * np.pi * var_d) - 0.5 * innovations ** 2 / var_d
            log_p_jump = (np.log(jump_prob)
                          - 0.5 * np.log(2 * np.pi * var_j)
                          - 0.5 * (innovations - mu_j) ** 2 / var_j)
            log_p_no_jump = np.log(1.0 - jump_prob) + log_p_diff

            # 数值稳定的softmax
            log_max = np.maximum(log_p_jump, log_p_no_jump)
            gamma_j = np.exp(log_p_jump - log_max) / (
                np.exp(log_p_jump - log_max) + np.exp(log_p_no_jump - log_max)
            )

            # 钳位: 确保至少min_diffusion_frac属于扩散
            if np.mean(gamma_j) > (1.0 - self.min_diff_frac):
                gamma_j *= (1.0 - self.min_diff_frac) / np.mean(gamma_j)

            # M-step
            w_diff = 1.0 - gamma_j
            w_jump = gamma_j

            sigma_d_new = np.sqrt(np.sum(w_diff * innovations ** 2) / (np.sum(w_diff) + 1e-10))
            lambda_j_new = float(np.mean(gamma_j)) / dt
            mu_j_new = float(np.sum(w_jump * innovations) / (np.sum(w_jump) + 1e-10))
            sigma_j_new = np.sqrt(
                np.sum(w_jump * (innovations - mu_j_new) ** 2) / (np.sum(w_jump) + 1e-10)
            )

            # 收敛检查
            log_lik = float(np.sum(np.logaddexp(log_p_no_jump, log_p_jump)))

            if abs(log_lik - log_lik_prev) < self.tol:
                break
            log_lik_prev = log_lik

            sigma_d = max(sigma_d_new, 1e-6)
            lambda_j = np.clip(lambda_j_new, 0.01, 10.0)
            mu_j = mu_j_new
            sigma_j = max(sigma_j_new, 1e-6)

        # 年化 (dt下限防止极端放大)
        effective_dt = max(dt, 1e-4)
        sigma_b_annual = sigma_d / np.sqrt(effective_dt) * np.sqrt(252)

        # 钳位: 防止NaN和极端值
        if not np.isfinite(sigma_b_annual):
            sigma_b_annual = 2.0
        sigma_b_annual = float(np.clip(sigma_b_annual, 0.5, 20.0))

        return JumpDiffusionParams(
            sigma_b=sigma_b_annual,
            lambda_j=float(lambda_j),
            mu_j=float(mu_j),
            sigma_j=float(sigma_j),
            log_likelihood=float(log_lik_prev)
        )

    def detect_jump(self, innovation: float, sigma_d: float) -> bool:
        """实时跳跃检测: 新息超过threshold×σ"""
        return abs(innovation) > self.jump_threshold * sigma_d


class CalibrationPipeline:
    """完整校准管线: Kalman → EM → regime分类"""

    def __init__(self, config: dict):
        kalman_cfg = config.get("kalman", {})
        em_cfg = config.get("em", {})

        self.kalman = KalmanFilter(
            process_noise=kalman_cfg.get("process_noise", 0.01),
            measurement_noise=kalman_cfg.get("measurement_noise", 0.05),
            initial_variance=kalman_cfg.get("initial_variance", 1.0),
        )
        self.em = EMJumpDiffusion(
            max_iter=em_cfg.get("max_iterations", 50),
            tol=em_cfg.get("convergence_threshold", 1e-6),
            jump_threshold_sigma=em_cfg.get("jump_threshold_sigma", 2.5),
            min_diffusion_frac=em_cfg.get("min_diffusion_fraction", 0.5),
        )

        self.vol_regimes = config.get("volatility_regimes", {})
        self._current_params: JumpDiffusionParams | None = None
        self._calibration_window = em_cfg.get("calibration_window", 100)
        self._min_observations_for_em = em_cfg.get("min_observations", 120)
        self._em_throttle_ticks = em_cfg.get("em_throttle_ticks", 5)  # 每N次tick运行一次EM（降低延迟）
        self._tick_counter = 0

    def update(self, logit_obs: float, spread_logit: float = 0.0,
               dt: float = 1.0 / 24.0) -> CalibrationResult:
        """
        实时更新: 每次新观测到达时调用
        dt: 时间步长(天), 默认1小时
        """
        ks = self.kalman.update(logit_obs, spread=spread_logit)
        self._tick_counter += 1

        # 节流: 每N次tick运行一次EM，避免500ms间隔下的计算浪费
        innovations = self.kalman.get_innovations(self._calibration_window)
        # 至少120次观测(约60秒@500ms)才有统计意义
        run_em = (self._tick_counter % self._em_throttle_ticks == 0) or self._current_params is None
        if run_em and len(innovations) >= self._min_observations_for_em:
            self._current_params = self.em.fit(innovations, dt=dt)
        elif self._current_params is None:
            self._current_params = JumpDiffusionParams(
                sigma_b=2.0, lambda_j=0.5, mu_j=0.0, sigma_j=0.5
            )

        # 跳跃检测
        sigma_d_instant = self._current_params.sigma_b / np.sqrt(252) * np.sqrt(dt)
        jump_detected = self.em.detect_jump(ks.innovation, sigma_d_instant) if sigma_d_instant > 0 else False

        regime = self._classify_regime(self._current_params.sigma_b)

        return CalibrationResult(
            kalman_state=ks,
            jd_params=self._current_params,
            regime=regime,
            jump_detected=jump_detected,
            innovations=innovations,
        )

    def _classify_regime(self, sigma_b: float) -> str:
        if sigma_b < 1.5:
            return "low"
        elif sigma_b < 3.0:
            return "normal"
        elif sigma_b < 5.0:
            return "high"
        else:
            return "crisis"

    @property
    def current_params(self) -> JumpDiffusionParams | None:
        return self._current_params

    def reset(self):
        self.kalman.state = None
        self.kalman.innovations.clear()
        self._current_params = None
