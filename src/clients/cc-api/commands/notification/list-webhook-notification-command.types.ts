import type { WebhookNotification } from './notification.types.js';

export interface ListWebhookNotificationCommandInput {
  ownerId: string;
}

export type ListWebhookNotificationCommandOutput = Array<WebhookNotification>;
