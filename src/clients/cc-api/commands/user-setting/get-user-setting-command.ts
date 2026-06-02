/**
 * @import { GetUserSettingCommandInput, GetUserSettingCommandOutput } from './get-user-setting-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { QueryParams } from '../../../../lib/request/query-params.js';
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
    return {
      method: 'GET',
      url: safeUrl`/v4/console/settings/${params.name}`,
      queryParams: new QueryParams().append('env', this.params.env),
      headers: new HeadersBuilder().acceptTextPlain().acceptJson().build(),
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetUserSettingCommandInput, GetUserSettingCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.value;
  }
}
