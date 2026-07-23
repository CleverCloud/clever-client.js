import type { WebhookNotification } from './notification.types.js';

export interface ListWebhookNotificationCommandInput {
  ownerId: string;
}

// transformed: sorted by name, then createdAt
export type ListWebhookNotificationCommandOutput = Array<WebhookNotification>;
