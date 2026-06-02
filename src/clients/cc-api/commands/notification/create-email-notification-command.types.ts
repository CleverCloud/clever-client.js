import type {
  EmailNotification,
  EmailNotificationTarget,
  NotificationEventType,
  NotificationMetaEventType,
} from './notification.types.js';

export interface CreateEmailNotificationCommandInput {
  ownerId: string;
  name: string;
  targets: Array<EmailNotificationTarget>;
  events?: Array<NotificationEventType | NotificationMetaEventType>;
  scope?: Array<string>;
}

export type CreateEmailNotificationCommandOutput = EmailNotification;
