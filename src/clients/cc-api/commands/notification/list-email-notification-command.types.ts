import type { EmailNotification } from './notification.types.js';

export interface ListEmailNotificationCommandInput {
  ownerId: string;
}

// transformed: sorted by name, then createdAt
export type ListEmailNotificationCommandOutput = Array<EmailNotification>;
