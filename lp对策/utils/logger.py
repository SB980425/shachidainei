"""Logging配置"""
import logging
import sys
from pathlib import Path


def setup_logger(name: str = "mm", level: str = "INFO", log_file: str | None = None) -> logging.Logger:
    fmt = logging.Formatter(
        "[%(asctime)s] %(levelname)-7s %(name)-12s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # 配置root logger — 所有模块(strategy.*, exchange.*, core.*)的日志都会被捕获
    root = logging.getLogger()
    root.setLevel(getattr(logging, level.upper(), logging.INFO))

    if not root.handlers:
        # Console
        sh = logging.StreamHandler(sys.stdout)
        sh.setFormatter(fmt)
        root.addHandler(sh)

        # File
        if log_file:
            Path(log_file).parent.mkdir(parents=True, exist_ok=True)
            fh = logging.FileHandler(log_file, encoding="utf-8")
            fh.setFormatter(fmt)
            root.addHandler(fh)

    logger = logging.getLogger(name)
    return logger
