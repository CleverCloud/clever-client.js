import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteEmailNotificationCommandInput } from './delete-email-notification-command.types.js';

/**
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
}
