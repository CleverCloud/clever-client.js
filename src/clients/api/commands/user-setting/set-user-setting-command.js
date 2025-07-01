/**
 * @import { SetUserSettingCommandInput } from './set-user-setting-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { QueryParams } from '../../../../lib/request/query-params.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<SetUserSettingCommandInput, void>}
 * @endpoint [PUT] /v4/console/settings/:XXX
 * @group UserSetting
 * @version 4
 */
export class SetUserSettingCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<SetUserSettingCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return {
      method: 'PUT',
      url: safeUrl`/v4/console/settings/${params.name}`,
      queryParams: new QueryParams().append('env', this.params.env),
      body: params.value,
      headers: new HeadersBuilder().acceptTextPlain().acceptJson().contentTypeTextPlain().build(),
    };
  }
}
