/**
 * @import { CreateEmailNotificationCommandInput, CreateEmailNotificationCommandOutput } from './create-email-notification-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformEmailNotification } from './notification-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateEmailNotificationCommandInput, CreateEmailNotificationCommandOutput>}
 * @endpoint [POST] /v2/notifications/emailhooks/:XXX
 * @group Notification
 * @version 2
 */
export class CreateEmailNotificationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateEmailNotificationCommandInput, CreateEmailNotificationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const notified = params.targets.map((target) => {
      switch (target.type) {
        case 'email':
          return {
            type: 'email',
            target: target.emailAddresses.join(','),
          };
        case 'organisation':
          return {
            type: 'organisation',
          };
        case 'user':
          return {
            type: 'userid',
          };
      }
    });

    return post(safeUrl`/v2/notifications/emailhooks/${params.ownerId}`, {
      name: params.name,
      notified,
      events: params.events,
      scope: params.scope,
    });
  }

  /** @type {CcApiSimpleCommand<CreateEmailNotificationCommandInput, CreateEmailNotificationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformEmailNotification(response);
  }
}
