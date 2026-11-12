import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  ListEmailNotificationCommandInput,
  ListEmailNotificationCommandOutput,
} from './list-email-notification-command.types.ts';
import { transformEmailNotification } from './notification-transform.ts';

/**
 * Lists the email hooks watching an owner.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}
