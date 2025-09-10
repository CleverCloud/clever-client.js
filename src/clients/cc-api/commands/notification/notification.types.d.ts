export interface WebhookNotification {
  id: string;
  ownerId: string;
  name?: string;
  urls: Array<WebhookNotificationUrl>;
  events?: Array<NotificationEventType | NotificationMetaEventType>;
  scope?: Array<string>;
  createdAt: string;
  failures: Array<WebhookNotificationRequestFailure>;
  state: 'ENABLED' | 'DISABLED';
}

export interface WebhookNotificationUrl {
  format: WebhookNotificationFormat;
  url: string;
}

export type WebhookNotificationFormat = 'raw' | 'slack' | 'flowdock' | 'gitter';

export interface WebhookNotificationRequestFailure {
  url: String;
  networkFailure?: string;
  status?: number;
  partialBody?: string;
  createdAt?: string;
}

export interface EmailNotification {
  id: string;
  ownerId: string;
  name?: string;
  // renamed from notified
  targets: Array<EmailNotificationTarget>;
  events?: Array<NotificationEventType | NotificationMetaEventType>;
  scope?: Array<string>;
  createdAt: string;
}

export type EmailNotificationTarget =
  | EmailNotificationTargetEmail
  | EmailNotificationTargetUser
  | EmailNotificationTargetOrganisation;

export interface EmailNotificationTargetEmail {
  type: 'email';
  emailAddresses: Array<string>;
}

export interface EmailNotificationTargetUser {
  type: 'user';
}

export interface EmailNotificationTargetOrganisation {
  type: 'organisation';
}

export type NotificationEventType =
  | 'ACCOUNT_CREATION'
  | 'ACCOUNT_DELETION'
  | 'ACCOUNT_EDITION'
  | 'ADDON_CREATION'
  | 'ADDON_DELETION'
  | 'APPLICATION_CREATION'
  | 'APPLICATION_DELETION'
  | 'APPLICATION_EDITION'
  | 'APPLICATION_REDEPLOY'
  | 'APPLICATION_STOP'
  | 'CLEVER_TOOLS_REQUEST'
  | 'CREDITS_ADDED'
  | 'DEPLOYMENT_ACTION_BEGIN'
  | 'DEPLOYMENT_ACTION_END'
  | 'DEPLOYMENT_FAIL'
  | 'DEPLOYMENT_SUCCESS'
  | 'GIT_PUSH'
  | 'ORGANISATION_CREATION'
  | 'ORGANISATION_DELETION'
  | 'ORGANISATION_EDITION'
  | 'ORGANISATION_USER_ADDITION';

export type NotificationMetaEventType =
  | 'META_SERVICE_LIFECYCLE'
  | 'META_DEPLOYMENT_RESULT'
  | 'META_SERVICE_MANAGEMENT'
  | 'META_CREDITS';
