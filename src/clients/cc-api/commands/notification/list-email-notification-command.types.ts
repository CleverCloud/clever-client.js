import type { EmailNotification } from './notification.types.js';

/**
 * Identifies the owner whose email hooks are listed.
 */
export interface ListEmailNotificationCommandInput {
  /** Identifier of the user or organisation. */
  ownerId: string;
}

/**
 * The email hooks, sorted by name then by creation date.
 */
export type ListEmailNotificationCommandOutput = Array<EmailNotification>;
