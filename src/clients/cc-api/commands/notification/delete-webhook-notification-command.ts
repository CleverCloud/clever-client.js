import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteWebhookNotificationCommandInput } from './delete-webhook-notification-command.types.js';

/**
 * @endpoint [DELETE] /v2/notifications/webhooks/:XXX/:XXX
 * @group Notification
 * @version 2
 */
export class DeleteWebhookNotificationCommand extends CcApiSimpleCommand<DeleteWebhookNotificationCommandInput, void> {
  toRequestParams(params: DeleteWebhookNotificationCommandInput) {
    return delete_(safeUrl`/v2/notifications/webhooks/${params.ownerId}/${params.webhookNotificationId}`);
  }
}
