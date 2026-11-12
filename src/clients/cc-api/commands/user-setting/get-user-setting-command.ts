import { HeadersBuilder } from '../../../../lib/request/headers-builder.ts';
import { QueryParams } from '../../../../lib/request/query-params.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import type { CcRequestParams } from '../../../../types/request.types.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetUserSettingCommandInput, GetUserSettingCommandOutput } from './get-user-setting-command.types.ts';

/**
 * Reads one Console preference of the current user.
 *
 * Settings are arbitrary string values the Console stores per user, optionally scoped to an
 * environment so that a preference set in production does not leak into a test environment.
 *
 * @endpoint [GET] /v4/console/settings/:XXX
 * @group UserSetting
 * @version 4
 */
export class GetUserSettingCommand extends CcApiSimpleCommand<GetUserSettingCommandInput, GetUserSettingCommandOutput> {
  toRequestParams(params: GetUserSettingCommandInput): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/v4/console/settings/${params.name}`,
      queryParams: new QueryParams().append('env', this.params.environment),
      headers: new HeadersBuilder().acceptTextPlain().acceptJson().build(),
    };
  }

  transformCommandOutput(response: unknown): GetUserSettingCommandOutput {
    return (response as { value: string }).value;
  }

  isIdempotent(): boolean {
    return true;
  }
}
