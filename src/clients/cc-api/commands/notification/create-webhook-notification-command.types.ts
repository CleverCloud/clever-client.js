import type {
  NotificationEventType,
  NotificationMetaEventType,
  WebhookNotification,
  WebhookNotificationUrl,
} from './notification.types.js';

export interface CreateWebhookNotificationCommandInput {
  ownerId: string;
  name: string;
  urls: Array<WebhookNotificationUrl>;
  events?: Array<NotificationEventType | NotificationMetaEventType>;
  scopes?: Array<string>;
}

export type CreateWebhookNotificationCommandOutput = WebhookNotification;
