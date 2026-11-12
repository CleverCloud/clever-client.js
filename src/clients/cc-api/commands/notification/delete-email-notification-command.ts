import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { DeleteEmailNotificationCommandInput } from './delete-email-notification-command.types.ts';

/**
 * Removes an email hook, which stops mailing events.
 *
 * @endpoint [DELETE] /v2/notifications/emailhooks/:XXX/:XXX
 * @group Notification
 * @version 2
 */
export class DeleteEmailNotificationCommand extends CcApiSimpleCommand<DeleteEmailNotificationCommandInput, undefined> {
  toRequestParams(params: DeleteEmailNotificationCommandInput) {
    return delete_(safeUrl`/v2/notifications/emailhooks/${params.ownerId}/${params.emailNotificationId}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
