import { normalizeDate, sortBy, unknownToClient } from '../../../../lib/utils.js';
import type { UnknownToClient } from '../../../../types/utils.types.js';
import type { GetNotificationInfoEventsCommandOutput } from './get-notification-info-command.types.js';
import type {
  EmailNotification,
  EmailNotificationTarget,
  NotificationEventType,
  NotificationMetaEventType,
  WebhookNotification,
  WebhookNotificationRequestFailure,
  WebhookNotificationUrl,
} from './notification.types.js';

export function transformWebhookNotification(payload: any): WebhookNotification {
  return {
    id: payload.id,
    ownerId: payload.ownerId,
    name: payload.name,
    urls: payload.urls.map(transformWebhookNotificationUrl),
    events: payload.events?.sort(),
    scopes: payload.scope?.sort(),
    createdAt: normalizeDate(payload.createdAt)!,
    failures: payload.failures.map(transformWebhookNotificationRequestFailure),
    state: payload.state,
  };
}

function transformWebhookNotificationUrl(payload: any): WebhookNotificationUrl {
  return {
    format: payload.format,
    url: payload.url,
  };
}

function transformWebhookNotificationRequestFailure(payload: any): WebhookNotificationRequestFailure {
  return {
    url: payload.url,
    networkFailure: payload.networkFailure ?? undefined,
    status: payload.status ?? undefined,
    partialBody: payload.partialBody ?? undefined,
    createdAt: normalizeDate(payload.createdAt)!,
  };
}

export function transformEmailNotification(payload: any): EmailNotification {
  return {
    id: payload.id,
    ownerId: payload.ownerId,
    name: payload.name,
    targets: payload.notified == null ? undefined : sortBy(payload.notified.map(transformTarget), 'type'),
    events: payload.events?.sort(),
    scopes: payload.scope?.sort(),
    createdAt: normalizeDate(payload.createdAt)!,
  };
}

function transformTarget(payload: any): EmailNotificationTarget | UnknownToClient {
  switch (payload.type) {
    case 'email':
      return {
        type: 'email',
        emailAddress: payload.target,
      };
    case 'organisation':
      return {
        type: 'organisation',
      };
    case 'userid':
      return {
        type: 'user',
        userId: payload.target,
      };
    default:
      return unknownToClient('type', payload);
  }
}

export function transformNotificationInfoEvents(response: any): GetNotificationInfoEventsCommandOutput {
  return {
    events: response.events,
    // The endpoint answers `meta_events` as an array of `{ key, events }`, keyed here so callers can
    // look a meta event up without scanning
    metaEvents: Object.fromEntries(
      response.meta_events.map((metaEvent: any) => [metaEvent.key, metaEvent.events]),
    ) as Record<NotificationMetaEventType, Array<NotificationEventType>>,
  };
}
