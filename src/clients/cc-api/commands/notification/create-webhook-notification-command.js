/**
 * @import { CreateWebhookNotificationCommandInput, CreateWebhookNotificationCommandOutput } from './create-webhook-notification-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateWebhookNotificationCommandInput, CreateWebhookNotificationCommandOutput>}
 * @endpoint [POST] /v2/notifications/webhooks/:XXX
 * @group Notification
 * @version 2
 */
export class CreateWebhookNotificationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateWebhookNotificationCommandInput, CreateWebhookNotificationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v2/notifications/webhooks/${params.ownerId}`, {
      name: params.name,
      urls: params.urls,
      events: params.events,
      scope: params.scope,
    });
  }
}
