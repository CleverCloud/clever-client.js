import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { transformAuthMfaBackupCodes } from './auth-transform.js';
import { sendResolvingRefusedCredential } from './auth-utils.js';
import type {
  ConfirmAuthMfaCommandInput,
  ConfirmAuthMfaCommandOutput,
  ConfirmAuthMfaCommandResponse,
} from './confirm-auth-mfa-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_PASSWORD`: the account password is wrong
 * - `INVALID_MFA_CODE`: the code does not match the enrolment secret
 * - `MFA_ALREADY_ENABLED`: the factor is already active
 * - `ENROLMENT_NOT_FOUND`: no enrolment is pending, either none was started or it was already confirmed: a
 *   replay after a lost response meets this one. Check {@link GetAuthMfaCommand}, and if the factor is on,
 *   get new backup codes with {@link ResetAuthMfaBackupCodesCommand}
 * - `ALMIGHTY_TOKEN_REQUIRED`: the client authenticates with a token not allowed to manage the account
 *   security settings, such as an API token or a restricted OAuth consumer
 */
export const CONFIRM_AUTH_MFA_ERROR_CODES = {
  INVALID_PASSWORD: 'clever.auth.invalid-password',
  INVALID_MFA_CODE: 'clever.auth.invalid-mfa-code',
  MFA_ALREADY_ENABLED: 'clever.auth.mfa-already-enabled',
  ENROLMENT_NOT_FOUND: 'clever.auth.mfa-enrolment-not-found',
  ALMIGHTY_TOKEN_REQUIRED: 'clever.auth.almighty-token-required',
} as const;

export type ConfirmAuthMfaErrorCode = (typeof CONFIRM_AUTH_MFA_ERROR_CODES)[keyof typeof CONFIRM_AUTH_MFA_ERROR_CODES];

const API_ERROR_CODES: Record<string, ConfirmAuthMfaErrorCode> = {
  // `WRONG_PASSWORD`, a 401 for a missing or wrong `X-Clever-Password` header
  '3029': CONFIRM_AUTH_MFA_ERROR_CODES.INVALID_PASSWORD,
  // `MFA_BAD_CODE`, a 400
  '3103': CONFIRM_AUTH_MFA_ERROR_CODES.INVALID_MFA_CODE,
  // `MFA_CONFLICT`, a 409
  '3102': CONFIRM_AUTH_MFA_ERROR_CODES.MFA_ALREADY_ENABLED,
  // `MFA_NOT_FOUND`, a 404 when no enrolment secret is pending
  '3101': CONFIRM_AUTH_MFA_ERROR_CODES.ENROLMENT_NOT_FOUND,
  // `USER_DATA_ACCESS`, a 403 for a token that is not almighty
  '7301': CONFIRM_AUTH_MFA_ERROR_CODES.ALMIGHTY_TOKEN_REQUIRED,
};

/**
 * Confirms a second factor enrolment by proving the authenticator app is correctly set up, and
 * returns the backup codes once.
 *
 * The factor only becomes active once this succeeds. The account password is sent base64-encoded in
 * the `X-Clever-Password` header.
 *
 * A refused password or code rejects, unless `shouldResolveRefusedCredential` is set: it then
 * resolves with its code in `type`, and the `hooks.onError` callback of the client never sees it.
 *
 * Common error codes: see {@link CONFIRM_AUTH_MFA_ERROR_CODES}
 *
 * @endpoint [POST] /v2/self/mfa/:XXX/confirmation
 * @group Auth
 * @version 2
 */
export class ConfirmAuthMfaCommand<
  TInput extends ConfirmAuthMfaCommandInput = ConfirmAuthMfaCommandInput,
> extends CcApiCompositeCommand<TInput, ConfirmAuthMfaCommandOutput<TInput>> {
  async compose(params: TInput, composer: CcApiComposer): Promise<ConfirmAuthMfaCommandOutput<TInput>> {
    return sendResolvingRefusedCredential<ConfirmAuthMfaCommandOutput<TInput>>(
      params,
      () => composer.send(new ConfirmAuthMfaInnerCommand(params)),
      'confirmed',
      {
        'invalid-password': CONFIRM_AUTH_MFA_ERROR_CODES.INVALID_PASSWORD,
        'invalid-mfa-code': CONFIRM_AUTH_MFA_ERROR_CODES.INVALID_MFA_CODE,
      },
    );
  }

  // the API drops the pending enrolment once confirmed, so a replay rejects with `ENROLMENT_NOT_FOUND` and an
  // enrolment is never confirmed twice; it still loses the backup codes, which only the first response carried
  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Confirms the enrolment, rejecting on a refused password or code.
 *
 * @endpoint [POST] /v2/self/mfa/:XXX/confirmation
 * @group Auth
 * @version 2
 */
class ConfirmAuthMfaInnerCommand extends CcApiSimpleCommand<ConfirmAuthMfaCommandInput, ConfirmAuthMfaCommandResponse> {
  toRequestParams(params: ConfirmAuthMfaCommandInput): Partial<CcRequestParams> {
    return {
      method: 'POST',
      url: safeUrl`/v2/self/mfa/${params.kind}/confirmation`,
      headers: new HeadersBuilder()
        .acceptJson()
        .contentTypeJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
      body: {
        code: params.code,
        revokeTokens: params.shouldRevokeTokens,
      },
    };
  }

  transformCommandOutput(response: unknown): ConfirmAuthMfaCommandResponse {
    return transformAuthMfaBackupCodes(response);
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  // the API drops the pending enrolment once confirmed, so a replay rejects with `ENROLMENT_NOT_FOUND`
  isIdempotent(): boolean {
    return true;
  }
}
