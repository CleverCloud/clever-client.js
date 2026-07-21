import { CcClientError, CcHttpError, CcRequestError } from '../lib/error/cc-client-errors.js';
import { TOO_MANY_REQUESTS_ERROR_CODE } from '../lib/error/handle-http-errors.js';

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
