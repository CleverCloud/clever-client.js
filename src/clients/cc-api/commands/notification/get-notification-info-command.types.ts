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
  /** Every event that can be watched individually. */
  events: Array<NotificationEventType>;
  /** Which events each meta event stands for, keyed by meta event. Read from the payload's `meta_events`. */
  metaEvents: Record<NotificationMetaEventType, Array<NotificationEventType>>;
}
