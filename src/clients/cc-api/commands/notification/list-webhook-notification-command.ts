import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  ListWebhookNotificationCommandInput,
  ListWebhookNotificationCommandOutput,
} from './list-webhook-notification-command.types.js';
import { transformWebhookNotification } from './notification-transform.js';

/**
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
}
