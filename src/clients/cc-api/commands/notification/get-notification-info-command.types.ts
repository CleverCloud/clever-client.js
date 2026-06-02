import type {
  NotificationEventType,
  NotificationMetaEventType,
  WebhookNotificationFormat,
} from './notification.types.js';

export interface GetNotificationInfoCommandOutput extends GetNotificationInfoEventsCommandOutput {
  formats: Array<WebhookNotificationFormat>;
}

export interface GetNotificationInfoEventsCommandOutput {
  events: Array<NotificationEventType>;
  metaEvents: Record<NotificationMetaEventType, Array<NotificationEventType>>;
}
