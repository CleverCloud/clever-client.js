import { isCcHttpErrorWithCode } from '../../../../utils/error-utils.js';
import type { RefusedAuthCredentialType, ResolveRefusedCredentialInput } from './auth.types.js';

/**
 * Sends the request of a command taking {@link ResolveRefusedCredentialInput}, and shapes its output
 * after `shouldResolveRefusedCredential`.
 *
 * Unset or `false`, the response is returned as is and a refused credential rejects. Set, the
 * response is tagged with the success `type`, and each refusal resolves as `{ type }` instead of
 * rejecting: the composite recovers from the error, so the client never reports it to
 * `hooks.onError`. Every other error still rejects.
 *
 * @template Output - The output of the command for its input
 * @param params - The input of the command
 * @param send - Sends the request and resolves its response
 * @param successType - The `type` of the result when the request succeeds
 * @param refusals - The error code each refusal the command can meet rejects with, as the command transforms it
 */
export async function sendResolvingRefusedCredential<Output>(
  params: ResolveRefusedCredentialInput,
  send: () => Promise<object | undefined>,
  successType: string,
  refusals: Partial<Record<RefusedAuthCredentialType, string>>,
): Promise<Output> {
  // TypeScript cannot narrow the conditional output type on a runtime check, so the result is asserted
  if (params.shouldResolveRefusedCredential !== true) {
    return (await send()) as Output;
  }
  try {
    return { type: successType, ...(await send()) } as Output;
  } catch (error) {
    const refusal = Object.entries(refusals).find(([, code]) => code != null && isCcHttpErrorWithCode(error, code));
    if (refusal == null) {
      throw error;
    }
    return { type: refusal[0] } as Output;
  }
}
