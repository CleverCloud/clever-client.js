/**
 * @import { UpdateUserSettingCommandInput } from './update-user-setting-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateUserSettingCommandInput, void>}
 * @endpoint [PUT] /v4/console/settings/:XXX
 * @group UserSetting
 * @version 4
 */
export class UpdateUserSettingCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateUserSettingCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v4/console/settings/:XXX`, {});
  }
}
