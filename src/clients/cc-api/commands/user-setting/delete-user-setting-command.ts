import { QueryParams } from '../../../../lib/request/query-params.ts';
import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { DeleteUserSettingCommandInput } from './delete-user-setting-command.types.ts';

/**
 * Removes one Console preference of the current user, which falls back to its default.
 *
 * @endpoint [DELETE] /v4/console/settings/:XXX
 * @group UserSetting
 * @version 4
 */
export class DeleteUserSettingCommand extends CcApiSimpleCommand<DeleteUserSettingCommandInput, undefined> {
  toRequestParams(params: DeleteUserSettingCommandInput) {
    return delete_(
      safeUrl`/v4/console/settings/${params.name}`,
      new QueryParams().append('env', this.params.environment),
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // `HDEL`, and the per-user quota counter only moves when the name was actually removed
  isIdempotent(): boolean {
    return true;
  }
}
