/**
 * @import { GetAuthMfaBackupCodesCommandInput, GetAuthMfaBackupCodesCommandOutput } from './get-auth-mfa-backup-codes-command.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetAuthMfaBackupCodesCommandInput, GetAuthMfaBackupCodesCommandOutput>}
 * @endpoint [GET] /v2/self/mfa/:XXX/backupcodes
 * @group Auth
 * @version 2
 */
export class GetAuthMfaBackupCodesCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetAuthMfaBackupCodesCommandInput, GetAuthMfaBackupCodesCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return {
      method: 'GET',
      url: safeUrl`/v2/self/mfa/${params.kind}/backupcodes`,
      headers: new HeadersBuilder()
        .acceptJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
    };
  }

  /** @type {CcApiSimpleCommand<GetAuthMfaBackupCodesCommandInput, GetAuthMfaBackupCodesCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(/** @param {{code: string}} o */ (o) => o.code);
  }
}
