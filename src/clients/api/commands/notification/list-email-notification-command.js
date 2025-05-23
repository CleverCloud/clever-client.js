/**
 * @import { ListEmailNotificationCommandInput, ListEmailNotificationCommandOutput } from './list-email-notification-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListEmailNotificationCommandInput, ListEmailNotificationCommandOutput>}
 * @endpoint [GET] /v2/notifications/emailhooks/:XXX
 * @group Notification
 * @version 2
 */
export class ListEmailNotificationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListEmailNotificationCommandInput, ListEmailNotificationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/notifications/emailhooks/:XXX`);
  }

  /** @type {CcApiSimpleCommand<ListEmailNotificationCommandInput, ListEmailNotificationCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
