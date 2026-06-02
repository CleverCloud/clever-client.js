/**
 * @import { DeleteUserSettingCommandInput } from './delete-user-setting-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteUserSettingCommandInput, void>}
 * @endpoint [DELETE] /v4/console/settings/:XXX
 * @group UserSetting
 * @version 4
 */
export class DeleteUserSettingCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteUserSettingCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v4/console/settings/${params.name}`, new QueryParams().append('env', this.params.env));
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
