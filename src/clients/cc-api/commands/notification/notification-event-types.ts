/**
 * Every platform event a notification can fire on, in the order they should be presented to a user.
 */
export const NOTIFICATION_EVENT_TYPES = [
  'ACCOUNT_CREATION',
  'ACCOUNT_DELETION',
  'ACCOUNT_EDITION',
  'ADDON_CREATION',
  'ADDON_DELETION',
  'APPLICATION_CREATION',
  'APPLICATION_DELETION',
  'APPLICATION_EDITION',
  'APPLICATION_REDEPLOY',
  'APPLICATION_STOP',
  'CLEVER_TOOLS_REQUEST',
  'CREDITS_ADDED',
  'DEPLOYMENT_ACTION_BEGIN',
  'DEPLOYMENT_ACTION_END',
  'DEPLOYMENT_FAIL',
  'DEPLOYMENT_SUCCESS',
  'GIT_PUSH',
  'ORGANISATION_CREATION',
  'ORGANISATION_DELETION',
  'ORGANISATION_EDITION',
  'ORGANISATION_USER_ADDITION',
] as const;

/**
 * Every shorthand standing for a whole family of events, in the order they should be presented to a
 * user. A notification listing one of these does not have to list the events one by one, and keeps
 * working when new events are added to the family.
 *
 * Which events each one covers is not fixed here: `GetNotificationInfoCommand` answers the current
 * mapping in its `metaEvents`.
 */
export const NOTIFICATION_META_EVENT_TYPES = [
  'META_SERVICE_LIFECYCLE',
  'META_DEPLOYMENT_RESULT',
  'META_SERVICE_MANAGEMENT',
  'META_CREDITS',
] as const;

/**
 * A platform event a notification can fire on.
 */
export type NotificationEventType = (typeof NOTIFICATION_EVENT_TYPES)[number];

/**
 * A shorthand standing for a whole family of events, so a notification does not have to list them
 * one by one and keeps working when new events are added to the family.
 */
export type NotificationMetaEventType = (typeof NOTIFICATION_META_EVENT_TYPES)[number];
