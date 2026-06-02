import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  ListEmailNotificationCommandInput,
  ListEmailNotificationCommandOutput,
} from './list-email-notification-command.types.js';
import { transformEmailNotification } from './notification-transform.js';

/**
 * @endpoint [GET] /v2/notifications/emailhooks/:XXX
 * @group Notification
 * @version 2
 */
export class ListEmailNotificationCommand extends CcApiSimpleCommand<
  ListEmailNotificationCommandInput,
  ListEmailNotificationCommandOutput
> {
  toRequestParams(params: ListEmailNotificationCommandInput) {
    return get(safeUrl`/v2/notifications/emailhooks/${params.ownerId}`);
  }

  transformCommandOutput(response: unknown): ListEmailNotificationCommandOutput {
    return sortBy((response as Array<unknown>).map(transformEmailNotification), 'name', 'createdAt');
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
