/**
 * RabbitMQ event pattern constants.
 * Use these instead of hardcoded strings to avoid typos and enable refactoring.
 */
export const EVENTS = {
  USER_CREATED: 'user_created',
  TUTOR_CREATED: 'tutor_created',
  COURSE_CREATED: 'course_created',
  COURSE_UPDATED: 'course_updated',
  ENROLLMENT_CREATED: 'enrollment_created',
  INTERACTION_LOGGED: 'interaction_logged',
} as const;

export type EventPattern = (typeof EVENTS)[keyof typeof EVENTS];
