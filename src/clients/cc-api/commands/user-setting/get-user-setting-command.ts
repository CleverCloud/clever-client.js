import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { QueryParams } from '../../../../lib/request/query-params.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetUserSettingCommandInput, GetUserSettingCommandOutput } from './get-user-setting-command.types.js';

/**
 * @endpoint [GET] /v4/console/settings/:XXX
 * @group UserSetting
 * @version 4
 */
export class GetUserSettingCommand extends CcApiSimpleCommand<GetUserSettingCommandInput, GetUserSettingCommandOutput> {
  toRequestParams(params: GetUserSettingCommandInput): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/v4/console/settings/${params.name}`,
      queryParams: new QueryParams().append('env', this.params.env),
      headers: new HeadersBuilder().acceptTextPlain().acceptJson().build(),
    };
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetUserSettingCommandOutput {
    return (response as { value: string }).value;
  }
}
