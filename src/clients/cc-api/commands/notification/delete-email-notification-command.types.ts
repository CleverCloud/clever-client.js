/**
 * Identifies the email hook to remove.
 */
export interface DeleteEmailNotificationCommandInput {
  /** Identifier of the user or organisation the hook belongs to. */
  ownerId: string;
  /** Identifier of the email hook. */
  emailNotificationId: string;
}
