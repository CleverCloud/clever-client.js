/**
 * @import { GetAuthMfaBackupCodesCommandInput, GetAuthMfaBackupCodesCommandOutput } from './get-auth-mfa-backup-codes-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
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
    return get(safeUrl`/v2/self/mfa/${params.kind}/backupcodes`);
  }

  /** @type {CcApiSimpleCommand<GetAuthMfaBackupCodesCommandInput, GetAuthMfaBackupCodesCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      secret: response.secret,
      recoveryCodes: response.recoveryCodes.map(/** @param {{code: string}} o */ (o) => o.code),
    };
  }
}
