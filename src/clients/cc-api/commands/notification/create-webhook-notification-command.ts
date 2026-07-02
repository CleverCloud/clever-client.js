import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  CreateWebhookNotificationCommandInput,
  CreateWebhookNotificationCommandOutput,
} from './create-webhook-notification-command.types.js';

/**
 * @endpoint [POST] /v2/notifications/webhooks/:XXX
 * @group Notification
 * @version 2
 */
export class CreateWebhookNotificationCommand extends CcApiSimpleCommand<
  CreateWebhookNotificationCommandInput,
  CreateWebhookNotificationCommandOutput
> {
  toRequestParams(params: CreateWebhookNotificationCommandInput) {
    return post(safeUrl`/v2/notifications/webhooks/${params.ownerId}`, {
      name: params.name,
      urls: params.urls,
      events: params.events,
      scope: params.scope,
    });
  }
}
