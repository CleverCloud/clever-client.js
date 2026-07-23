import type { WebhookNotification } from './notification.types.js';

/**
 * Identifies the owner whose webhooks are listed.
 */
export interface ListWebhookNotificationCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}

/**
 * The webhooks, sorted by name then by creation date.
 */
export type ListWebhookNotificationCommandOutput = Array<WebhookNotification>;
