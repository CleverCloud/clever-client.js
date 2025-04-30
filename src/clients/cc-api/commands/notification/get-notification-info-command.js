/**
 * @import { GetNotificationInfoCommandOutput, GetNotificationInfoEventsCommandOutput } from './get-notification-info-command.types.js';
 * @import { WebhookNotificationFormat } from './notification.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<void, GetNotificationInfoCommandOutput>}
 * @endpoint [GET] /v2/notifications/info/events
 * @endpoint [GET] /v2/notifications/info/webhookformats
 * @group Notification
 * @version 2
 */
export class GetNotificationInfoCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<void, GetNotificationInfoCommandOutput>['compose']} */
  async compose(_params, composer) {
    return {
      formats: await composer.send(new GetNotificationInfoWebhookFormatsCommand()),
      ...(await composer.send(new GetNotificationInfoEventsCommand())),
    };
  }
}

/**
 * @extends {CcApiSimpleCommand<void, GetNotificationInfoEventsCommandOutput>}
 * @endpoint [GET] /v2/notifications/info/events
 * @group Notification
 * @version 2
 */
class GetNotificationInfoEventsCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, GetNotificationInfoEventsCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(safeUrl`/v2/notifications/info/events`);
  }

  /** @type {CcApiSimpleCommand<void, GetNotificationInfoEventsCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      events: response.events,
      metaEvents: {
        META_SERVICE_LIFECYCLE: response.meta_events.META_SERVICE_LIFECYCLE,
        META_DEPLOYMENT_RESULT: response.meta_events.META_DEPLOYMENT_RESULT,
        META_SERVICE_MANAGEMENT: response.meta_events.META_SERVICE_MANAGEMENT,
        META_CREDITS: response.meta_events.META_CREDITS,
      },
    };
  }
}

/**
 * @extends {CcApiSimpleCommand<void, Array<WebhookNotificationFormat>>}
 * @endpoint [GET] /v2/notifications/info/webhookformats
 * @group Notification
 * @version 2
 */
class GetNotificationInfoWebhookFormatsCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, Array<WebhookNotificationFormat>>['toRequestParams']} */
  toRequestParams() {
    return get(safeUrl`/v2/notifications/info/webhookformats`);
  }
}
