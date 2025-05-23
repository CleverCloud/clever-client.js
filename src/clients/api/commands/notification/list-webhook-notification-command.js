/**
 * @import { ListWebhookNotificationCommandInput, ListWebhookNotificationCommandOutput } from './list-webhook-notification-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListWebhookNotificationCommandInput, ListWebhookNotificationCommandOutput>}
 * @endpoint [GET] /v2/notifications/webhooks/:XXX
 * @group Notification
 * @version 2
 */
export class ListWebhookNotificationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListWebhookNotificationCommandInput, ListWebhookNotificationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/notifications/webhooks/:XXX`);
  }

  /** @type {CcApiSimpleCommand<ListWebhookNotificationCommandInput, ListWebhookNotificationCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
