/**
 * @import { EmailNotification } from './notification.types.d.ts'
 */

/**
 *
 * @param {any} response
 * @returns {EmailNotification}
 */
export function transformEmailNotification(response) {
  return {
    id: response.id,
    ownerId: response.ownerId,
    name: response.name,
    targets: response.notified?.map(
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
    events: response.events,
    scope: response.scope,
    createdAt: response.createdAt,
  };
}
