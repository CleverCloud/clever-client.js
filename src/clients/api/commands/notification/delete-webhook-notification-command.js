/**
 * @import { DeleteWebhookNotificationCommandInput, DeleteWebhookNotificationCommandOutput } from './delete-webhook-notification-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteWebhookNotificationCommandInput, DeleteWebhookNotificationCommandOutput>}
 * @endpoint [DELETE] /v2/notifications/webhooks/:XXX/:XXX
 * @group Notification
 * @version 2
 */
export class DeleteWebhookNotificationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteWebhookNotificationCommandInput, DeleteWebhookNotificationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/notifications/webhooks/:XXX/:XXX`);
  }
}
