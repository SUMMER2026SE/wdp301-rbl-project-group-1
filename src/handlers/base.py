from abc import ABC, abstractmethod
from typing import Any


class BaseEventHandler(ABC):
    """
    Abstract base class for all RabbitMQ event handlers.
    Each subclass handles one or more event patterns.
    """

    @abstractmethod
    async def handle(self, payload: dict[str, Any]) -> None:
        """Process the event payload."""
        ...
