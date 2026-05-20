"""
RabbitMQ event pattern constants.
Mirrors the EVENTS constant in the NestJS backend (events.constants.ts).
Use these instead of hardcoded strings to avoid typos and enable refactoring.
"""

USER_CREATED = "user_created"
TUTOR_CREATED = "tutor_created"
COURSE_CREATED = "course_created"
COURSE_UPDATED = "course_updated"
ENROLLMENT_CREATED = "enrollment_created"
INTERACTION_LOGGED = "interaction_logged"
