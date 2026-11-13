import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { DeleteWebhookNotificationCommandInput } from './delete-webhook-notification-command.types.ts';

/**
 * Removes a webhook, which stops posting events.
 *
 * @endpoint [DELETE] /v2/notifications/webhooks/:XXX/:XXX
 * @group Notification
 * @version 2
 */
export class DeleteWebhookNotificationCommand extends CcApiSimpleCommand<
  DeleteWebhookNotificationCommandInput,
  undefined
> {
  toRequestParams(params: DeleteWebhookNotificationCommandInput) {
    return delete_(safeUrl`/v2/notifications/webhooks/${params.ownerId}/${params.webhookNotificationId}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
