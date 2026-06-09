/**
 * RabbitMQ event pattern constants.
 * Use these instead of hardcoded strings to avoid typos and enable refactoring.
 */
export const EVENTS = {
  USER_CREATED: 'user_created',
  TUTOR_CREATED: 'tutor_created',
  TUTOR_UPDATED: 'tutor_updated',
  BOOKING_CREATED: 'booking_created',
  BOOKING_COMPLETED: 'booking_completed',
  INTERACTION_LOGGED: 'interaction_logged',
} as const;

export type EventPattern = (typeof EVENTS)[keyof typeof EVENTS];
