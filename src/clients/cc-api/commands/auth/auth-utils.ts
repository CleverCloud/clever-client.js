import { isCcHttpErrorWithCode } from '../../../../utils/error-utils.js';
import type { RefusedAuthCredential, RefusedAuthCredentialType } from './auth.types.js';

// the error code each refusal rejects with, once the command transformed it
const REFUSED_CREDENTIAL_ERROR_CODES: Record<RefusedAuthCredentialType, string> = {
  'invalid-password': 'clever.auth.invalid-password',
  'invalid-mfa-code': 'clever.auth.invalid-mfa-code',
};

/**
 * Sends the requests of a composite command, resolving the given refusals instead of rejecting.
 *
 * The composite recovers from the error, so the client never reports it to `hooks.onError`. Every
 * other error still rejects.
 *
 * @param send - Sends the requests and resolves the result of the command
 * @param refusals - The refusals the command can meet
 */
export async function resolveRefusedCredential<Result, Type extends RefusedAuthCredentialType>(
  send: () => Promise<Result>,
  refusals: ReadonlyArray<Type>,
): Promise<Result | RefusedAuthCredential<Type>> {
  try {
    return await send();
  } catch (error) {
    const refusal = refusals.find((type) => isCcHttpErrorWithCode(error, REFUSED_CREDENTIAL_ERROR_CODES[type]));
    if (refusal == null) {
      throw error;
    }
    return { type: refusal };
  }
}
