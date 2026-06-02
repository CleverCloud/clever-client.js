import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type {
  GetNotificationInfoCommandOutput,
  GetNotificationInfoEventsCommandOutput,
} from './get-notification-info-command.types.js';
import { transformNotificationInfoEvents } from './notification-transform.js';
import type { WebhookNotificationFormat } from './notification.types.js';

/**
 * @endpoint [GET] /v2/notifications/info/events
 * @endpoint [GET] /v2/notifications/info/webhookformats
 * @group Notification
 * @version 2
 */
export class GetNotificationInfoCommand extends CcApiCompositeCommand<void, GetNotificationInfoCommandOutput> {
  async compose(_params: void, composer: CcApiComposer): Promise<GetNotificationInfoCommandOutput> {
    return {
      formats: await composer.send(new GetNotificationInfoWebhookFormatsCommand()),
      ...(await composer.send(new GetNotificationInfoEventsCommand())),
    };
  }
}

/**
 * @endpoint [GET] /v2/notifications/info/events
 * @group Notification
 * @version 2
 */
class GetNotificationInfoEventsCommand extends CcApiSimpleCommand<void, GetNotificationInfoEventsCommandOutput> {
  toRequestParams() {
    return get(safeUrl`/v2/notifications/info/events`);
  }

  transformCommandOutput(response: unknown): GetNotificationInfoEventsCommandOutput {
    return transformNotificationInfoEvents(response);
  }
}

/**
 * @endpoint [GET] /v2/notifications/info/webhookformats
 * @group Notification
 * @version 2
 */
class GetNotificationInfoWebhookFormatsCommand extends CcApiSimpleCommand<void, Array<WebhookNotificationFormat>> {
  toRequestParams() {
    return get(safeUrl`/v2/notifications/info/webhookformats`);
  }
}
