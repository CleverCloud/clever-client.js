import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import type {
  GetNotificationInfoCommandOutput,
  GetNotificationInfoEventsCommandOutput,
} from './get-notification-info-command.types.ts';
import { transformNotificationInfoEvents } from './notification-transform.ts';
import type { WebhookNotificationFormat } from './notification.types.ts';

/**
 * Lists what notifications can be built from: the events that can be watched, the meta events
 * grouping them, and the webhook payload formats on offer.
 *
 * Meant to feed a notification editor without hardcoding the platform's vocabulary.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Lists the events that can be watched, and the meta events grouping them.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Lists the payload formats a webhook can post in.
 *
 * @endpoint [GET] /v2/notifications/info/webhookformats
 * @group Notification
 * @version 2
 */
class GetNotificationInfoWebhookFormatsCommand extends CcApiSimpleCommand<void, Array<WebhookNotificationFormat>> {
  toRequestParams() {
    return get(safeUrl`/v2/notifications/info/webhookformats`);
  }

  isIdempotent(): boolean {
    return true;
  }
}
