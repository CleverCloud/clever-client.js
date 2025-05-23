/**
 * @import { GetUserSettingCommandInput, GetUserSettingCommandOutput } from './get-user-setting-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetUserSettingCommandInput, GetUserSettingCommandOutput>}
 * @endpoint [GET] /v4/console/settings/:XXX
 * @group UserSetting
 * @version 4
 */
export class GetUserSettingCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetUserSettingCommandInput, GetUserSettingCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/console/settings/:XXX`);
  }

  /** @type {CcApiSimpleCommand<GetUserSettingCommandInput, GetUserSettingCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
