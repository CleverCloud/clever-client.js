/**
 * @import { CreateEmailNotificationCommandInput, CreateEmailNotificationCommandOutput } from './create-email-notification-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

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
    return post(safeUrl`/v2/notifications/emailhooks/:XXX`, {});
  }
}
