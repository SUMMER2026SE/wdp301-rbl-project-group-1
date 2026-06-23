"""
Handler registry: maps RabbitMQ event patterns → handler instances.
To add a new handler, import it here and add an entry to HANDLER_REGISTRY.
"""

from src.config import events as Events
from src.handlers.user_handler import (
    UserCreatedHandler,
    TutorCreatedHandler,
    TutorUpdatedHandler,
)
from src.handlers.interaction_handler import (
    InteractionLoggedHandler,
    BookingCreatedHandler,
    BookingCompletedHandler,
    ReviewCreatedHandler,
)

HANDLER_REGISTRY: dict = {
    # User & Tutor lifecycle
    Events.USER_CREATED:   UserCreatedHandler(),
    Events.TUTOR_CREATED:  TutorCreatedHandler(),
    Events.TUTOR_UPDATED:  TutorUpdatedHandler(),

    # Interaction signals
    Events.INTERACTION_LOGGED:  InteractionLoggedHandler(),
    Events.BOOKING_CREATED:     BookingCreatedHandler(),
    Events.BOOKING_COMPLETED:   BookingCompletedHandler(),
    Events.REVIEW_CREATED:      ReviewCreatedHandler(),
}
