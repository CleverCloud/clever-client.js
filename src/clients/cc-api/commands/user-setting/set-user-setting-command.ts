import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { QueryParams } from '../../../../lib/request/query-params.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { SetUserSettingCommandInput } from './set-user-setting-command.types.js';

/**
 * @endpoint [PUT] /v4/console/settings/:XXX
 * @group UserSetting
 * @version 4
 */
export class SetUserSettingCommand extends CcApiSimpleCommand<SetUserSettingCommandInput, void> {
  toRequestParams(params: SetUserSettingCommandInput): Partial<CcRequestParams> {
    return {
      method: 'PUT',
      url: safeUrl`/v4/console/settings/${params.name}`,
      queryParams: new QueryParams().append('env', this.params.env),
      body: params.value,
      headers: new HeadersBuilder().acceptTextPlain().acceptJson().contentTypeTextPlain().build(),
    };
  }
}
