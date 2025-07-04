/**
 * @import { EmailNotification } from './notification.types.d.ts'
 */

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
    targets: payload.notified?.map(
      /** @param {any} n */ (n) => {
        switch (n.type) {
          case 'email':
            return {
              type: 'email',
              emailAddresses: n.target.split(','),
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
      },
    ),
    events: payload.events,
    scope: payload.scope,
    createdAt: payload.createdAt,
  };
}
