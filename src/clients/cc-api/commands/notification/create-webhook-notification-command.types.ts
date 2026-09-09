import type {
  NotificationEventType,
  NotificationMetaEventType,
  WebhookNotification,
  WebhookNotificationUrl,
} from './notification.types.js';

/**
 * Description of the webhook to create.
 */
export interface CreateWebhookNotificationCommandInput {
  /** Identifier of the user or organisation to watch. */
  ownerId: string;
  /** Display name of the webhook. */
  name: string;
  /** Where the events are posted, and in which format. */
  urls: Array<WebhookNotificationUrl>;
  /** Events to fire on. Leave it out to fire on every event. */
  events?: Array<NotificationEventType | NotificationMetaEventType>;
  /**
   * Identifiers of the applications and add-ons to restrict the webhook to. Leave it out to watch the whole
   * organisation.
   * @sentAs `scope`
   */
  scopes?: Array<string>;
}

/**
 * The freshly created webhook.
 */
export type CreateWebhookNotificationCommandOutput = WebhookNotification;
