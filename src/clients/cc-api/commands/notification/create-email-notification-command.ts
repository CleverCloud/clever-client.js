import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  CreateEmailNotificationCommandInput,
  CreateEmailNotificationCommandOutput,
} from './create-email-notification-command.types.js';
import { transformEmailNotification } from './notification-transform.js';

/**
 * @endpoint [POST] /v2/notifications/emailhooks/:XXX
 * @group Notification
 * @version 2
 */
export class CreateEmailNotificationCommand extends CcApiSimpleCommand<
  CreateEmailNotificationCommandInput,
  CreateEmailNotificationCommandOutput
> {
  toRequestParams(params: CreateEmailNotificationCommandInput) {
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

  transformCommandOutput(response: unknown): CreateEmailNotificationCommandOutput {
    return transformEmailNotification(response);
  }
}
