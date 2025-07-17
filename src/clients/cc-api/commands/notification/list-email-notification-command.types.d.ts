import type { EmailNotification } from './notification.types.js';

export interface ListEmailNotificationCommandInput {
  ownerId: string;
}

export type ListEmailNotificationCommandOutput = Array<EmailNotification>;
