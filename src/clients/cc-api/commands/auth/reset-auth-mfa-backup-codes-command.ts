import { HeadersBuilder } from '../../../../lib/request/headers-builder.ts';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.ts';
import type { ApiErrorInfo } from '../../../../types/command.types.ts';
import type { CcRequestParams } from '../../../../types/request.types.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import { transformAuthMfaBackupCodes } from './auth-transform.ts';
import { sendResolvingRefusedCredential } from './auth-utils.ts';
import type {
  ResetAuthMfaBackupCodesCommandInput,
  ResetAuthMfaBackupCodesCommandOutput,
  ResetAuthMfaBackupCodesCommandResponse,
} from './reset-auth-mfa-backup-codes-command.types.ts';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_PASSWORD`: the account password is wrong
 * - `MFA_NOT_FOUND`: the factor is not active
 * - `ALMIGHTY_TOKEN_REQUIRED`: the client authenticates with a token not allowed to manage the account
 *   security settings, such as an API token or a restricted OAuth consumer
 */
export const RESET_AUTH_MFA_BACKUP_CODES_ERROR_CODES = {
  INVALID_PASSWORD: 'clever.auth.invalid-password',
  MFA_NOT_FOUND: 'clever.auth.mfa-not-found',
  ALMIGHTY_TOKEN_REQUIRED: 'clever.auth.almighty-token-required',
} as const;

export type ResetAuthMfaBackupCodesErrorCode =
  (typeof RESET_AUTH_MFA_BACKUP_CODES_ERROR_CODES)[keyof typeof RESET_AUTH_MFA_BACKUP_CODES_ERROR_CODES];

const API_ERROR_CODES: Record<string, ResetAuthMfaBackupCodesErrorCode> = {
  // `WRONG_PASSWORD`, a 401 for a missing or wrong `X-Clever-Password` header
  '3029': RESET_AUTH_MFA_BACKUP_CODES_ERROR_CODES.INVALID_PASSWORD,
  // `MFA_NOT_FOUND`, a 404
  '3101': RESET_AUTH_MFA_BACKUP_CODES_ERROR_CODES.MFA_NOT_FOUND,
  // `USER_DATA_ACCESS`, a 403 for a token that is not almighty
  '7301': RESET_AUTH_MFA_BACKUP_CODES_ERROR_CODES.ALMIGHTY_TOKEN_REQUIRED,
};

/**
 * Replaces the backup codes of the current user with a new set, and returns it once.
 *
 * The previous codes stop working. The account password is sent base64-encoded in the
 * `X-Clever-Password` header.
 *
 * A refused password rejects, unless `shouldResolveRefusedCredential` is set: it then resolves with
 * its code in `type`, and the `hooks.onError` callback of the client never sees it.
 *
 * Common error codes: see {@link RESET_AUTH_MFA_BACKUP_CODES_ERROR_CODES}
 *
 * @endpoint [POST] /v2/self/mfa/:XXX/backupcodes
 * @group Auth
 * @version 2
 */
export class ResetAuthMfaBackupCodesCommand<
  TInput extends ResetAuthMfaBackupCodesCommandInput = ResetAuthMfaBackupCodesCommandInput,
> extends CcApiCompositeCommand<TInput, ResetAuthMfaBackupCodesCommandOutput<TInput>> {
  async compose(params: TInput, composer: CcApiComposer): Promise<ResetAuthMfaBackupCodesCommandOutput<TInput>> {
    return sendResolvingRefusedCredential<ResetAuthMfaBackupCodesCommandOutput<TInput>>(
      params,
      () => composer.send(new ResetAuthMfaBackupCodesInnerCommand(params)),
      'reset',
      { 'invalid-password': RESET_AUTH_MFA_BACKUP_CODES_ERROR_CODES.INVALID_PASSWORD },
    );
  }

  // each call invalidates the codes the previous one returned, so a replay loses the codes of the first response
  isIdempotent(): boolean {
    return false;
  }
}

/**
 * Replaces the backup codes, rejecting on a refused password.
 *
 * @endpoint [POST] /v2/self/mfa/:XXX/backupcodes
 * @group Auth
 * @version 2
 */
class ResetAuthMfaBackupCodesInnerCommand extends CcApiSimpleCommand<
  ResetAuthMfaBackupCodesCommandInput,
  ResetAuthMfaBackupCodesCommandResponse
> {
  toRequestParams(params: ResetAuthMfaBackupCodesCommandInput): Partial<CcRequestParams> {
    return {
      method: 'POST',
      url: safeUrl`/v2/self/mfa/${params.kind}/backupcodes`,
      headers: new HeadersBuilder()
        .acceptJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
    };
  }

  transformCommandOutput(response: unknown): ResetAuthMfaBackupCodesCommandResponse {
    return transformAuthMfaBackupCodes(response);
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  // each call invalidates the codes the previous one returned, so a replay loses the codes of the first response
  isIdempotent(): boolean {
    return false;
  }
}
