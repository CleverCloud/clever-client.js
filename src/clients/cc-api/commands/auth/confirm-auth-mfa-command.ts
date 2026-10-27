import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { resolveRefusedCredential } from './auth-utils.js';
import type { ConfirmAuthMfaCommandInput, ConfirmAuthMfaCommandOutput } from './confirm-auth-mfa-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_PASSWORD`: the account password is wrong
 * - `INVALID_MFA_CODE`: the code does not match the enrolment secret
 * - `MFA_ALREADY_ENABLED`: the factor is already active
 * - `ENROLMENT_NOT_FOUND`: no enrolment was started
 */
export const CONFIRM_AUTH_MFA_ERROR_CODES = {
  INVALID_PASSWORD: 'clever.auth.invalid-password',
  INVALID_MFA_CODE: 'clever.auth.invalid-mfa-code',
  MFA_ALREADY_ENABLED: 'clever.auth.mfa-already-enabled',
  ENROLMENT_NOT_FOUND: 'clever.auth.mfa-enrolment-not-found',
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
};

/**
 * Confirms a second factor enrolment by proving the authenticator app is correctly set up.
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
    // TypeScript cannot narrow a conditional type on a runtime check, so each branch asserts it
    if (params.shouldResolveRefusedCredential !== true) {
      return (await composer.send(new ConfirmAuthMfaInnerCommand(params))) as ConfirmAuthMfaCommandOutput<TInput>;
    }
    const result = await resolveRefusedCredential(async () => {
      await composer.send(new ConfirmAuthMfaInnerCommand(params));
      return { type: 'confirmed' as const };
    }, ['invalid-password', 'invalid-mfa-code']);
    return result as ConfirmAuthMfaCommandOutput<TInput>;
  }

  // once the factor is active, the endpoint answers with a conflict, so an enrolment is never confirmed twice
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
class ConfirmAuthMfaInnerCommand extends CcApiSimpleCommand<ConfirmAuthMfaCommandInput, undefined> {
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

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  // once the factor is active, the endpoint answers with a conflict, so an enrolment is never confirmed twice
  isIdempotent(): boolean {
    return true;
  }
}
