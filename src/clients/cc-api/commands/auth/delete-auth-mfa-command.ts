import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { encodeToBase64, safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { resolveRefusedCredential } from './auth-utils.js';
import type { DeleteAuthMfaCommandInput, DeleteAuthMfaCommandOutput } from './delete-auth-mfa-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_PASSWORD`: the account password is wrong
 * - `MFA_NOT_FOUND`: the factor is not active
 */
export const DELETE_AUTH_MFA_ERROR_CODES = {
  INVALID_PASSWORD: 'clever.auth.invalid-password',
  MFA_NOT_FOUND: 'clever.auth.mfa-not-found',
} as const;

export type DeleteAuthMfaErrorCode = (typeof DELETE_AUTH_MFA_ERROR_CODES)[keyof typeof DELETE_AUTH_MFA_ERROR_CODES];

const API_ERROR_CODES: Record<string, DeleteAuthMfaErrorCode> = {
  // `WRONG_PASSWORD`, a 401 for a missing or wrong `X-Clever-Password` header
  '3029': DELETE_AUTH_MFA_ERROR_CODES.INVALID_PASSWORD,
  // `MFA_NOT_FOUND`, a 404
  '3101': DELETE_AUTH_MFA_ERROR_CODES.MFA_NOT_FOUND,
};

/**
 * Turns a second authentication factor off for the current user.
 *
 * The account password is sent base64-encoded in the `X-Clever-Password` header.
 *
 * A refused password rejects, unless `shouldResolveRefusedCredential` is set: it then resolves with
 * its code in `type`, and the `hooks.onError` callback of the client never sees it.
 *
 * Common error codes: see {@link DELETE_AUTH_MFA_ERROR_CODES}
 *
 * @endpoint [DELETE] /v2/self/mfa/:XXX
 * @group Auth
 * @version 2
 */
export class DeleteAuthMfaCommand<
  TInput extends DeleteAuthMfaCommandInput = DeleteAuthMfaCommandInput,
> extends CcApiCompositeCommand<TInput, DeleteAuthMfaCommandOutput<TInput>> {
  async compose(params: TInput, composer: CcApiComposer): Promise<DeleteAuthMfaCommandOutput<TInput>> {
    // TypeScript cannot narrow a conditional type on a runtime check, so each branch asserts it
    if (params.shouldResolveRefusedCredential !== true) {
      return (await composer.send(new DeleteAuthMfaInnerCommand(params))) as DeleteAuthMfaCommandOutput<TInput>;
    }
    const result = await resolveRefusedCredential(async () => {
      await composer.send(new DeleteAuthMfaInnerCommand(params));
      return { type: 'deleted' as const };
    }, ['invalid-password']);
    return result as DeleteAuthMfaCommandOutput<TInput>;
  }

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Turns the factor off, rejecting on a refused password.
 *
 * @endpoint [DELETE] /v2/self/mfa/:XXX
 * @group Auth
 * @version 2
 */
class DeleteAuthMfaInnerCommand extends CcApiSimpleCommand<DeleteAuthMfaCommandInput, undefined> {
  toRequestParams(params: DeleteAuthMfaCommandInput): Partial<CcRequestParams> {
    return {
      method: 'DELETE',
      url: safeUrl`/v2/self/mfa/${params.kind}`,
      headers: new HeadersBuilder()
        .acceptJson()
        .withHeader('X-Clever-Password', encodeToBase64(params.password))
        .build(),
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  isIdempotent(): boolean {
    return true;
  }
}
