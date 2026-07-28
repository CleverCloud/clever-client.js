import type {
  NotificationEventType,
  NotificationMetaEventType,
  WebhookNotificationFormat,
} from './notification.types.js';

/**
 * Everything a notification can be built from.
 */
export interface GetNotificationInfoCommandOutput extends GetNotificationInfoEventsCommandOutput {
  /** Payload formats a webhook can post in. */
  formats: Array<WebhookNotificationFormat>;
}

/**
 * The events a notification can watch, and how they are grouped.
 *
 * @internal
 */
export interface GetNotificationInfoEventsCommandOutput {
  /** Every value a notification can watch: the individual events, and the meta events grouping them. */
  events: Array<NotificationEventType | NotificationMetaEventType>;
  /**
   * Which events each meta event stands for, keyed by meta event.
   * @renamedFrom `meta_events`
   * @converted from an array of `{ key, events }` to a map keyed by `key`
   */
  metaEvents: Record<NotificationMetaEventType, Array<NotificationEventType>>;
}
