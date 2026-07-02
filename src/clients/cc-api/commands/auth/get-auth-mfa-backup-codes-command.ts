import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetAuthMfaBackupCodesCommandInput,
  GetAuthMfaBackupCodesCommandOutput,
} from './get-auth-mfa-backup-codes-command.types.js';

/**
 * @endpoint [GET] /v2/self/mfa/:XXX/backupcodes
 * @group Auth
 * @version 2
 */
export class GetAuthMfaBackupCodesCommand extends CcApiSimpleCommand<
  GetAuthMfaBackupCodesCommandInput,
  GetAuthMfaBackupCodesCommandOutput
> {
  toRequestParams(params: GetAuthMfaBackupCodesCommandInput): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/v2/self/mfa/${params.kind}/backupcodes`,
      headers: new HeadersBuilder()
        .acceptJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
    };
  }

  transformCommandOutput(response: unknown): GetAuthMfaBackupCodesCommandOutput {
    return (response as Array<{ code: string }>).map((o) => o.code);
  }
}
