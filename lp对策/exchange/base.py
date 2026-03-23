"""
Exchange abstract base classes and shared data models.
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum


class Side(Enum):
    BUY = "BUY"
    SELL = "SELL"


class OrderType(Enum):
    GTC = "GTC"   # Good Til Cancelled
    FOK = "FOK"   # Fill Or Kill
    GTD = "GTD"   # Good Til Date


@dataclass
class OrderBookLevel:
    price: float
    size: float


@dataclass
class OrderBookSnapshot:
    token_id: str
    bids: list[OrderBookLevel]
    asks: list[OrderBookLevel]
    timestamp: float

    @property
    def best_bid(self) -> float:
        return self.bids[0].price if self.bids else 0.0

    @property
    def best_ask(self) -> float:
        return self.asks[0].price if self.asks else 1.0

    @property
    def mid_price(self) -> float:
        return (self.best_bid + self.best_ask) / 2.0

    @property
    def spread(self) -> float:
        return self.best_ask - self.best_bid


@dataclass
class MarketMetadata:
    token_id: str
    question: str = ""
    slug: str = ""
    condition_id: str = ""
    rewards_min_size: float = 0.0
    rewards_max_spread: float = 0.0
    rewards_daily_rate: float = 0.0
    tick_size: float = 0.01
    order_min_size: float = 0.0
    active: bool = True
    accepting_orders: bool = True


@dataclass
class OrderResponse:
    order_id: str
    success: bool
    message: str = ""
    filled_size: float = 0.0
    filled_price: float = 0.0


@dataclass
class Position:
    token_id: str
    size: float          # Positive for YES exposure, negative for NO exposure.
    avg_price: float
    market_name: str = ""


class ExchangeBase(ABC):

    @abstractmethod
    async def connect(self):
        ...

    @abstractmethod
    async def disconnect(self):
        ...

    @abstractmethod
    async def get_order_book(self, token_id: str) -> OrderBookSnapshot:
        ...

    @abstractmethod
    async def get_midpoint(self, token_id: str) -> float:
        ...

    @abstractmethod
    async def place_limit_order(
        self,
        token_id: str,
        side: Side,
        price: float,
        size: float,
        order_type: OrderType = OrderType.GTC,
    ) -> OrderResponse:
        ...

    @abstractmethod
    async def cancel_order(self, order_id: str) -> bool:
        ...

    @abstractmethod
    async def cancel_all_orders(self, token_id: str | None = None) -> int:
        ...

    @abstractmethod
    async def get_positions(self) -> list[Position]:
        ...

    @abstractmethod
    async def get_balance(self) -> float:
        ...

    @abstractmethod
    async def subscribe_orderbook(self, token_ids: list[str], callback):
        ...

    @abstractmethod
    async def subscribe_trades(self, token_ids: list[str], callback):
        ...

    async def prefetch_market_metadata(self, token_ids: list[str]):
        return None

    def get_market_metadata(self, token_id: str) -> MarketMetadata | None:
        return None
