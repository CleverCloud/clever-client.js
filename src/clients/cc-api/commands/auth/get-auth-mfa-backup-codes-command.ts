import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { resolveRefusedCredential } from './auth-utils.js';
import type {
  GetAuthMfaBackupCodesCommandInput,
  GetAuthMfaBackupCodesCommandOutput,
  GetAuthMfaBackupCodesCommandResponse,
} from './get-auth-mfa-backup-codes-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_PASSWORD`: the account password is wrong
 * - `MFA_NOT_FOUND`: the factor is not active
 */
export const GET_AUTH_MFA_BACKUP_CODES_ERROR_CODES = {
  INVALID_PASSWORD: 'clever.auth.invalid-password',
  MFA_NOT_FOUND: 'clever.auth.mfa-not-found',
} as const;

export type GetAuthMfaBackupCodesErrorCode =
  (typeof GET_AUTH_MFA_BACKUP_CODES_ERROR_CODES)[keyof typeof GET_AUTH_MFA_BACKUP_CODES_ERROR_CODES];

const API_ERROR_CODES: Record<string, GetAuthMfaBackupCodesErrorCode> = {
  // `WRONG_PASSWORD`, a 401 for a missing or wrong `X-Clever-Password` header
  '3029': GET_AUTH_MFA_BACKUP_CODES_ERROR_CODES.INVALID_PASSWORD,
  // `MFA_NOT_FOUND`, a 404
  '3101': GET_AUTH_MFA_BACKUP_CODES_ERROR_CODES.MFA_NOT_FOUND,
};

/**
 * Retrieves the backup codes that let the current user sign in when the authenticator app is lost.
 *
 * The account password is sent base64-encoded in the `X-Clever-Password` header.
 *
 * A refused password rejects, unless `shouldResolveRefusedCredential` is set: it then resolves with
 * its code in `type`, and the `hooks.onError` callback of the client never sees it.
 *
 * Common error codes: see {@link GET_AUTH_MFA_BACKUP_CODES_ERROR_CODES}
 *
 * @endpoint [GET] /v2/self/mfa/:XXX/backupcodes
 * @group Auth
 * @version 2
 */
export class GetAuthMfaBackupCodesCommand<
  TInput extends GetAuthMfaBackupCodesCommandInput = GetAuthMfaBackupCodesCommandInput,
> extends CcApiCompositeCommand<TInput, GetAuthMfaBackupCodesCommandOutput<TInput>> {
  async compose(params: TInput, composer: CcApiComposer): Promise<GetAuthMfaBackupCodesCommandOutput<TInput>> {
    // TypeScript cannot narrow a conditional type on a runtime check, so each branch asserts it
    if (params.shouldResolveRefusedCredential !== true) {
      return (await composer.send(
        new GetAuthMfaBackupCodesInnerCommand(params),
      )) as GetAuthMfaBackupCodesCommandOutput<TInput>;
    }
    const result = await resolveRefusedCredential(
      async () => ({
        type: 'retrieved' as const,
        backupCodes: await composer.send(new GetAuthMfaBackupCodesInnerCommand(params)),
      }),
      ['invalid-password'],
    );
    return result as GetAuthMfaBackupCodesCommandOutput<TInput>;
  }

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Retrieves the backup codes, rejecting on a refused password.
 *
 * @endpoint [GET] /v2/self/mfa/:XXX/backupcodes
 * @group Auth
 * @version 2
 */
class GetAuthMfaBackupCodesInnerCommand extends CcApiSimpleCommand<
  GetAuthMfaBackupCodesCommandInput,
  GetAuthMfaBackupCodesCommandResponse
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

  transformCommandOutput(response: unknown): GetAuthMfaBackupCodesCommandResponse {
    return (response as Array<{ code: string }>).map((o) => o.code);
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  isIdempotent(): boolean {
    return true;
  }
}
