"""
events.py — RabbitMQ event routing constants for the AI Recommendation System.
Mirrors EVENTS in the NestJS backend (events.constants.ts).

Usage:
    from src.config import events as Events
    HANDLER_REGISTRY[Events.TUTOR_CREATED] = TutorCreatedHandler()
"""

# -- User lifecycle --
USER_CREATED = "user_created"

# -- Tutor lifecycle --
TUTOR_CREATED  = "tutor_created"
TUTOR_UPDATED  = "tutor_updated"   # profile/subjects/grades/schedule changed

# -- Interaction events (high-value signals for recommendation) --
INTERACTION_LOGGED   = "interaction_logged"    # generic: VIEW_PROFILE, BID_ACCEPTED
BOOKING_CREATED      = "booking_created"       # student confirmed a tutor booking
BOOKING_COMPLETED    = "booking_completed"     # session(s) fully completed
