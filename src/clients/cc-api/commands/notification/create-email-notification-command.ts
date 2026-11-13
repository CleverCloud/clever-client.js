import { post } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  CreateEmailNotificationCommandInput,
  CreateEmailNotificationCommandOutput,
} from './create-email-notification-command.types.ts';
import { transformEmailNotification } from './notification-transform.ts';

/**
 * Creates an email hook, which mails platform events to a set of recipients as they happen.
 *
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
            target: target.emailAddress,
          };
        case 'organisation':
          return {
            type: 'organisation',
          };
        case 'user':
          return {
            type: 'userid',
            target: target.userId,
          };
      }
    });

    return post(safeUrl`/v2/notifications/emailhooks/${params.ownerId}`, {
      name: params.name,
      notified,
      events: params.events,
      scope: params.scopes,
    });
  }

  transformCommandOutput(response: unknown): CreateEmailNotificationCommandOutput {
    return transformEmailNotification(response);
  }

  // the handler inserts a hook under a freshly generated id, so a replay leaves the owner with two identical hooks
  isIdempotent(): boolean {
    return false;
  }
}
