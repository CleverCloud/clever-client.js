import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  ListWebhookNotificationCommandInput,
  ListWebhookNotificationCommandOutput,
} from './list-webhook-notification-command.types.ts';
import { transformWebhookNotification } from './notification-transform.ts';

/**
 * Lists the webhooks watching an owner.
 *
 * @endpoint [GET] /v2/notifications/webhooks/:XXX
 * @group Notification
 * @version 2
 */
export class ListWebhookNotificationCommand extends CcApiSimpleCommand<
  ListWebhookNotificationCommandInput,
  ListWebhookNotificationCommandOutput
> {
  toRequestParams(params: ListWebhookNotificationCommandInput) {
    return get(safeUrl`/v2/notifications/webhooks/${params.ownerId}`);
  }

  transformCommandOutput(response: unknown): ListWebhookNotificationCommandOutput {
    return sortBy((response as Array<unknown>).map(transformWebhookNotification), 'name', 'createdAt');
  }

  isIdempotent(): boolean {
    return true;
  }
}
