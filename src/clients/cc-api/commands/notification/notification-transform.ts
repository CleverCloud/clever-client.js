import { normalizeDate, sortBy } from '../../../../lib/utils.js';
import type { GetNotificationInfoEventsCommandOutput } from './get-notification-info-command.types.js';
import type {
  EmailNotification,
  EmailNotificationTarget,
  NotificationEventType,
  NotificationMetaEventType,
  WebhookNotification,
} from './notification.types.js';

export function transformWebhookNotification(payload: any): WebhookNotification {
  return {
    id: payload.id,
    ownerId: payload.ownerId,
    name: payload.name,
    urls: payload.urls,
    events: payload.events,
    scopes: payload.scope,
    createdAt: payload.createdAt,
    failures: payload.failures,
    state: payload.state,
  };
}

export function transformEmailNotification(payload: any): EmailNotification {
  return {
    id: payload.id,
    ownerId: payload.ownerId,
    name: payload.name,
    targets: sortBy(payload.notified?.map(transformTarget) ?? [], 'type'),
    events: payload.events?.sort() ?? [],
    scopes: payload.scope?.sort() ?? [],
    createdAt: normalizeDate(payload.createdAt)!,
  };
}

function transformTarget(payload: any): EmailNotificationTarget {
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
      throw new Error(`Unknown notification target type: ${payload.type}`);
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
