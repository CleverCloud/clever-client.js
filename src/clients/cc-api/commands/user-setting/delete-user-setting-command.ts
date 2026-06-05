import { QueryParams } from '../../../../lib/request/query-params.js';
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteUserSettingCommandInput } from './delete-user-setting-command.types.js';

/**
 * @endpoint [DELETE] /v4/console/settings/:XXX
 * @group UserSetting
 * @version 4
 */
export class DeleteUserSettingCommand extends CcApiSimpleCommand<DeleteUserSettingCommandInput, undefined> {
  toRequestParams(params: DeleteUserSettingCommandInput) {
    return delete_(safeUrl`/v4/console/settings/${params.name}`, new QueryParams().append('env', this.params.env));
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
