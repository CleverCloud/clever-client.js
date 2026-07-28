import type { CcRequestErrorCode } from '../lib/error/cc-client-errors.js';
import { CcClientError, CcHttpError, CcNetworkError, CcRequestError } from '../lib/error/cc-client-errors.js';
import { TOO_MANY_REQUESTS_ERROR_CODE } from '../lib/error/handle-http-errors.js';

/**
 * The error classes are re-exported as types only: `lib/error/cc-client-errors.js` is not a package
 * entry point, so this module is the only place consumers can name what the predicates below narrow
 * to. They get the names to annotate with, and keep going through the predicates rather than through
 * `instanceof`, which is what makes the class hierarchy an implementation detail we can still move.
 */
export type { CcClientError, CcHttpError, CcNetworkError, CcRequestError };

/**
 * The vocabulary of the codes, re-exported as values: unlike the classes, consumers legitimately
 * enumerate these — to word a message per failure, or to decide which ones are worth a retry.
 */
export {
  CC_REQUEST_ERROR_CODES,
  NETWORK_ERROR_CODES,
  NETWORK_ERRORS,
  NETWORK_RETRY_ADVICES,
  type CcRequestErrorCode,
  type NetworkErrorCode,
  type NetworkErrorInfo,
  type NetworkRetryAdvice,
} from '../lib/error/cc-client-errors.js';

/**
 * The code-only form of what `error.explanation` and `error.isWorthRetrying()` answer, for a caller
 * holding a `networkCode` away from the request it came with. With the error in hand, prefer those — the
 * error knows the request method too, and that is half of the retry answer.
 */
export { getNetworkErrorInfo } from '../lib/error/cc-client-errors.js';

export function isCcClientError(error: unknown): error is CcClientError {
  return error instanceof CcClientError;
}

export function isCcRequestError(error: unknown): error is CcRequestError {
  return error instanceof CcRequestError;
}

export function isCcHttpError(error: unknown): error is CcHttpError {
  return error instanceof CcHttpError;
}

/**
 * Whether the given error is a {@link CcHttpError} raised by a response with the given HTTP status.
 *
 * Prefer this over checking `error.statusCode` yourself: a bare property check matches any object
 * carrying a `statusCode`, whatever its origin.
 *
 * @param error - The value to test
 * @param status - The HTTP status code to match
 */
export function isCcHttpErrorWithStatus(error: unknown, status: number): error is CcHttpError {
  return isCcHttpError(error) && error.statusCode === status;
}

/**
 * Whether the given error is a {@link CcHttpError} reported with the given error code.
 *
 * The code is the one resolved by the client: either the code parsed from the response body and
 * mapped by the command, or one of the cross-cutting codes the client normalizes itself (see
 * {@link isRateLimitError}).
 *
 * @param error - The value to test
 * @param code - The error code to match
 */
export function isCcHttpErrorWithCode(error: unknown, code: string): error is CcHttpError {
  return isCcHttpError(error) && error.code === code;
}

/**
 * Whether the given error is a {@link CcRequestError} reported with the given error code.
 *
 * Use this for the codes the client raises when the request never reached a response, listed in
 * `CC_REQUEST_ERROR_CODES`. {@link isCcHttpErrorWithCode} matches the narrower {@link CcHttpError},
 * so it never matches those.
 *
 * @param error - The value to test
 * @param code - The error code to match
 */
export function isCcRequestErrorWithCode(error: unknown, code: CcRequestErrorCode): error is CcRequestError {
  return isCcRequestError(error) && error.code === code;
}

/**
 * Whether the given error was raised because the request never reached the server.
 *
 * That covers a failed DNS resolution, a refused or reset connection, a broken pipe and a connection
 * timeout, plus the opaque `TypeError` browsers raise for the same reasons. The client detects all of
 * them on the raw `fetch()` rejection, where the platform still describes the failure.
 *
 * Once this narrowed the error, `error.explanation` says what happened in a sentence fit to show,
 * `error.isWorthRetrying()` says whether to send the request again, and `error.networkCode` is there for
 * whoever wants to branch on the failure themselves.
 *
 * @param error - The value to test
 */
export function isNetworkError(error: unknown): error is CcNetworkError {
  return error instanceof CcNetworkError;
}

/**
 * Whether the given error was raised because the request was rate limited.
 *
 * The backends signal rate limiting in two different shapes (a 429 on v4, a 403 whose body `id` is
 * 403 on legacy v2); the client normalizes both to a single error code, which this predicate hides.
 *
 * @param error - The value to test
 */
export function isRateLimitError(error: unknown): error is CcHttpError {
  return isCcHttpErrorWithCode(error, TOO_MANY_REQUESTS_ERROR_CODE);
}

/**
 * Runs `promise` and resolves to `undefined` when it rejects with a 404. Any other error is rethrown.
 *
 * Commands reject on a 404, so callers for which a missing resource is a legitimate state (a
 * disabled feature, a deleted resource, ...) have to catch that error instead of checking the
 * resolved value. This wraps that `try`/`catch`.
 *
 * @param promise - The promise to run
 */
export async function tolerateNotFound<T>(promise: Promise<T>): Promise<T | undefined> {
  try {
    return await promise;
  } catch (error) {
    if (isCcHttpErrorWithStatus(error, 404)) {
      return undefined;
    }
    throw error;
  }
}
