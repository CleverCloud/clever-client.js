import type {
  EmailNotification,
  EmailNotificationTarget,
  NotificationEventType,
  NotificationMetaEventType,
} from './notification.types.js';

/**
 * Description of the email hook to create.
 */
export interface CreateEmailNotificationCommandInput {
  /** Identifier of the user or organisation to watch. */
  ownerId: string;
  /** Display name of the hook. */
  name: string;
  /**
   * Who gets the emails.
   * @sentAs `notified`
   * @converted with each target flattened to a `{ type, target }` pair
   */
  targets: Array<EmailNotificationTarget>;
  /** Events to fire on. Leave it out to fire on every event. */
  events?: Array<NotificationEventType | NotificationMetaEventType>;
  /**
   * Identifiers of the applications and add-ons to restrict the hook to. Leave it out to watch the whole organisation.
   * @sentAs `scope`
   */
  scopes?: Array<string>;
}

/**
 * The freshly created email hook.
 */
export type CreateEmailNotificationCommandOutput = EmailNotification;
