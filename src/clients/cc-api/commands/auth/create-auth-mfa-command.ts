import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { resolveRefusedCredential } from './auth-utils.js';
import type {
  CreateAuthMfaCommandInput,
  CreateAuthMfaCommandOutput,
  CreateAuthMfaCommandResponse,
} from './create-auth-mfa-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_PASSWORD`: the account password is wrong
 * - `EMAIL_NOT_VALIDATED`: the email address of the account is not validated yet
 * - `MFA_ALREADY_ENABLED`: the factor is already active, it has to be deleted first
 */
export const CREATE_AUTH_MFA_ERROR_CODES = {
  INVALID_PASSWORD: 'clever.auth.invalid-password',
  EMAIL_NOT_VALIDATED: 'clever.auth.email-not-validated',
  MFA_ALREADY_ENABLED: 'clever.auth.mfa-already-enabled',
} as const;

export type CreateAuthMfaErrorCode = (typeof CREATE_AUTH_MFA_ERROR_CODES)[keyof typeof CREATE_AUTH_MFA_ERROR_CODES];

const API_ERROR_CODES: Record<string, CreateAuthMfaErrorCode> = {
  // `WRONG_PASSWORD`, a 401 for a missing or wrong `X-Clever-Password` header
  '3029': CREATE_AUTH_MFA_ERROR_CODES.INVALID_PASSWORD,
  // `EMAIL_NOT_VALIDATED`, a 400
  '8502': CREATE_AUTH_MFA_ERROR_CODES.EMAIL_NOT_VALIDATED,
  // `MFA_CONFLICT`, a 409
  '3102': CREATE_AUTH_MFA_ERROR_CODES.MFA_ALREADY_ENABLED,
};

/**
 * Starts enrolling the current user into a second authentication factor.
 *
 * The returned URL is the enrolment secret, meant to be shown as a QR code. The factor only becomes
 * active once a code produced from it is confirmed. The account password is sent base64-encoded in
 * the `X-Clever-Password` header.
 *
 * A refused password rejects, unless `shouldResolveRefusedCredential` is set: it then resolves with
 * its code in `type`, and the `hooks.onError` callback of the client never sees it.
 *
 * Common error codes: see {@link CREATE_AUTH_MFA_ERROR_CODES}
 *
 * @endpoint [POST] /v2/self/mfa/:XXX
 * @group Auth
 * @version 2
 */
export class CreateAuthMfaCommand<
  TInput extends CreateAuthMfaCommandInput = CreateAuthMfaCommandInput,
> extends CcApiCompositeCommand<TInput, CreateAuthMfaCommandOutput<TInput>> {
  async compose(params: TInput, composer: CcApiComposer): Promise<CreateAuthMfaCommandOutput<TInput>> {
    // TypeScript cannot narrow a conditional type on a runtime check, so each branch asserts it
    if (params.shouldResolveRefusedCredential !== true) {
      return (await composer.send(new CreateAuthMfaInnerCommand(params))) as CreateAuthMfaCommandOutput<TInput>;
    }
    const result = await resolveRefusedCredential(
      async () => ({ type: 'created' as const, ...(await composer.send(new CreateAuthMfaInnerCommand(params))) }),
      ['invalid-password'],
    );
    return result as CreateAuthMfaCommandOutput<TInput>;
  }

  // every call mints a new secret and a new set of backup codes, replacing the enrolment being set up
  isIdempotent(): boolean {
    return false;
  }
}

/**
 * Starts the enrolment, rejecting on a refused password.
 *
 * @endpoint [POST] /v2/self/mfa/:XXX
 * @group Auth
 * @version 2
 */
class CreateAuthMfaInnerCommand extends CcApiSimpleCommand<CreateAuthMfaCommandInput, CreateAuthMfaCommandResponse> {
  toRequestParams(params: CreateAuthMfaCommandInput): Partial<CcRequestParams> {
    return {
      method: 'POST',
      url: safeUrl`/v2/self/mfa/${params.kind}`,
      headers: new HeadersBuilder()
        .acceptJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
    };
  }

  transformCommandOutput(response: unknown): CreateAuthMfaCommandResponse {
    const payload = response as { url: string };
    return {
      url: payload.url,
    };
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  // every call mints a new secret and a new set of backup codes, replacing the enrolment being set up
  isIdempotent(): boolean {
    return false;
  }
}
