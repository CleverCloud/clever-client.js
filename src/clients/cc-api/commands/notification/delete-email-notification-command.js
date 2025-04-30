/**
 * @import { DeleteEmailNotificationCommandInput } from './delete-email-notification-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteEmailNotificationCommandInput, void>}
 * @endpoint [DELETE] /v2/notifications/emailhooks/:XXX/:XXX
 * @group Notification
 * @version 2
 */
export class DeleteEmailNotificationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteEmailNotificationCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/notifications/emailhooks/${params.ownerId}/${params.emailNotificationId}`);
  }
}
