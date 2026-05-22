"""
Handler registry: maps event pattern strings to their handler instances.
To add a new handler, import it here and add an entry to HANDLER_REGISTRY.
"""

from src.config import events as Events
from src.handlers.user_handler import UserCreatedHandler, TutorCreatedHandler
from src.handlers.course_handler import CourseCreatedHandler, CourseUpdatedHandler
from src.handlers.interaction_handler import InteractionLoggedHandler

HANDLER_REGISTRY: dict = {
    Events.USER_CREATED: UserCreatedHandler(),
    Events.TUTOR_CREATED: TutorCreatedHandler(),
    Events.COURSE_CREATED: CourseCreatedHandler(),
    Events.COURSE_UPDATED: CourseUpdatedHandler(),
    Events.INTERACTION_LOGGED: InteractionLoggedHandler(),
}
