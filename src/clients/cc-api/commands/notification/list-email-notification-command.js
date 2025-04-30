/**
 * @import { ListEmailNotificationCommandInput, ListEmailNotificationCommandOutput } from './list-email-notification-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformEmailNotification } from './notification-transform.js';

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
    return get(safeUrl`/v2/notifications/emailhooks/${params.ownerId}`);
  }

  /** @type {CcApiSimpleCommand<ListEmailNotificationCommandInput, ListEmailNotificationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformEmailNotification), 'name', 'createdAt');
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
