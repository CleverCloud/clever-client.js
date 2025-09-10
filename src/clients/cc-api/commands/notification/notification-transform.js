/**
 * @import { EmailNotification, EmailNotificationTarget } from './notification.types.js'
 */
import { normalizeDate, sortBy } from '../../../../lib/utils.js';

/**
 *
 * @param {any} payload
 * @returns {EmailNotification}
 */
export function transformEmailNotification(payload) {
  return {
    id: payload.id,
    ownerId: payload.ownerId,
    name: payload.name,
    targets: sortBy(payload.notified?.map(transformTarget) ?? [], 'type'),
    events: payload.events?.sort() ?? [],
    scope: payload.scope?.sort() ?? [],
    createdAt: normalizeDate(payload.createdAt),
  };
}

/**
 * @param {any} payload
 * @returns {EmailNotificationTarget}
 */
function transformTarget(payload) {
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
  }
}
