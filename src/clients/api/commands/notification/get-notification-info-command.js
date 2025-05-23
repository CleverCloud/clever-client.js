/**
 * @import { GetNotificationInfoCommandOutput } from './get-notification-info-command.types.js';
 */
import { CcApiCompositeCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<void, GetNotificationInfoCommandOutput>}
 * @endpoint [GET] /v2/notifications/info/events
 * @group Notification
 * @version 2
 */
export class GetNotificationInfoCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<void, GetNotificationInfoCommandOutput>['compose']} */
  async compose(params, composer) {}
}
