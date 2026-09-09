/**
 * Identifies the webhook to remove.
 */
export interface DeleteWebhookNotificationCommandInput {
  /** Identifier of the user or organisation the webhook belongs to. */
  ownerId: string;
  /** Identifier of the webhook. */
  webhookNotificationId: string;
}
