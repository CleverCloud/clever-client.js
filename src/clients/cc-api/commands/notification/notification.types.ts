import type { UnknownToClient } from '../../../../types/utils.types.js';
import type { NotificationEventType, NotificationMetaEventType } from './notification-event-types.js';

export type { NotificationEventType, NotificationMetaEventType } from './notification-event-types.js';

/**
 * A webhook that posts platform events to one or more URLs as they happen.
 */
export interface WebhookNotification {
  /** Identifier of the webhook. */
  id: string;
  /** Identifier of the user or organisation the webhook watches. */
  ownerId: string;
  /** Display name of the webhook. */
  name?: string;
  /** Where the events are posted, and in which format. */
  urls: Array<WebhookNotificationUrl>;
  /** Events the webhook fires on. Absent means every event. */
  events?: Array<NotificationEventType | NotificationMetaEventType>;
  /**
   * Identifiers of the applications and add-ons the webhook is restricted to. Absent means the whole organisation.
   * @renamedFrom `scope`
   */
  scopes?: Array<string>;
  /** When the webhook was created, as an ISO date string. */
  createdAt: string;
  /** The recent delivery failures, to help diagnose a webhook that stopped working. */
  failures: Array<WebhookNotificationRequestFailure>;
  /** Whether the webhook still fires. The platform disables webhooks that keep failing. */
  state: 'ENABLED' | 'DISABLED';
}

/**
 * One destination of a webhook, and the payload shape it expects.
 */
export interface WebhookNotificationUrl {
  /** Payload shape to post, tailored to the receiving service. */
  format: WebhookNotificationFormat;
  /** URL the events are posted to. */
  url: string;
}

/**
 * The payload shapes a webhook can post: the platform's own format, or one tailored to a chat
 * service that renders it as a message.
 */
export type WebhookNotificationFormat = 'raw' | 'slack' | 'flowdock' | 'gitter';

/**
 * One delivery attempt that did not go through.
 */
export interface WebhookNotificationRequestFailure {
  /** URL the delivery was attempted on. */
  url: string;
  /** What went wrong at the network level, when the request never reached the server. */
  networkFailure?: string;
  /** HTTP status the server answered with, when it did answer. */
  status?: number;
  /** Beginning of the response body, to help identify the rejection. */
  partialBody?: string;
  /** When the attempt was made, as an ISO date string. */
  createdAt?: string;
}

/**
 * An email hook that mails platform events to a set of recipients as they happen.
 */
export interface EmailNotification {
  /** Identifier of the email hook. */
  id: string;
  /** Identifier of the user or organisation the hook watches. */
  ownerId: string;
  /** Display name of the hook. */
  name?: string;
  /**
   * Who gets the emails. Absent means the whole organisation. A target kind this client does not know is
   * published as {@link UnknownToClient}.
   * @renamedFrom `notified`
   * @converted sorted by type
   */
  targets?: Array<EmailNotificationTarget | UnknownToClient>;
  /** Events the hook fires on, sorted. Absent means every event. */
  events?: Array<NotificationEventType | NotificationMetaEventType>;
  /**
   * Identifiers of the applications and add-ons the hook is restricted to, sorted. Absent means the whole organisation.
   * @renamedFrom `scope`
   */
  scopes?: Array<string>;
  /**
   * When the hook was created.
   * @converted to an ISO date string
   */
  createdAt: string;
}

/**
 * Who an email hook mails: a fixed address, a specific member, or every member of the organisation.
 */
export type EmailNotificationTarget =
  | EmailNotificationTargetEmail
  | EmailNotificationTargetUser
  | EmailNotificationTargetOrganisation;

/**
 * Mails a fixed address, which does not have to belong to a Clever Cloud account.
 */
export interface EmailNotificationTargetEmail {
  /** Discriminant of the target. */
  type: 'email';
  /**
   * Address the emails go to.
   * @renamedFrom `target`
   */
  emailAddress: string;
}

/**
 * Mails one specific user, at whatever address their account carries.
 */
export interface EmailNotificationTargetUser {
  /**
   * Discriminant of the target.
   * @renamedFrom `userid`
   */
  type: 'user';
  /**
   * Identifier of the user.
   * @renamedFrom `target`
   */
  userId: string;
}

/**
 * Mails every member of the organisation the hook belongs to.
 */
export interface EmailNotificationTargetOrganisation {
  /** Discriminant of the target. */
  type: 'organisation';
}
