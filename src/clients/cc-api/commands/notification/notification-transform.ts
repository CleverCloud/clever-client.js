import { normalizeDate, sortBy } from '../../../../lib/utils.js';
import type { GetNotificationInfoEventsCommandOutput } from './get-notification-info-command.types.js';
import type { EmailNotification, EmailNotificationTarget } from './notification.types.js';

export function transformEmailNotification(payload: any): EmailNotification {
  return {
    id: payload.id,
    ownerId: payload.ownerId,
    name: payload.name,
    targets: sortBy(payload.notified?.map(transformTarget) ?? [], 'type'),
    events: payload.events?.sort() ?? [],
    scope: payload.scope?.sort() ?? [],
    createdAt: normalizeDate(payload.createdAt)!,
  };
}

function transformTarget(payload: any): EmailNotificationTarget {
  switch (payload.type) {
    case 'email':
      return {
        type: 'email',
        emailAddresses: payload.target.split(','),
      };
    case 'organisation':
      return {
        type: 'organisation',
      };
    case 'userid':
      return {
        type: 'user',
      };
    default:
      throw new Error(`Unknown notification target type: ${payload.type}`);
  }
}

export function transformNotificationInfoEvents(response: any): GetNotificationInfoEventsCommandOutput {
  return {
    events: response.events,
    metaEvents: {
      META_SERVICE_LIFECYCLE: response.meta_events.META_SERVICE_LIFECYCLE,
      META_DEPLOYMENT_RESULT: response.meta_events.META_DEPLOYMENT_RESULT,
      META_SERVICE_MANAGEMENT: response.meta_events.META_SERVICE_MANAGEMENT,
      META_CREDITS: response.meta_events.META_CREDITS,
    },
  };
}
