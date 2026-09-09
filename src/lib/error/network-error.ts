import type { CcRequest } from '../../types/request.types.js';
import type { NetworkErrorCode } from './cc-client-errors.js';
import { CcNetworkError, isNetworkErrorCode } from './cc-client-errors.js';

/**
 * What can be read off a `fetch()` rejection, which is untyped: runtimes disagree on where they
 * report the failure, and the value is not even guaranteed to be an `Error`. Every field is therefore
 * what we hope to find, not what we are given — `errors` in particular is the `AggregateError` Node
 * raises when it tried several addresses for the same host and all of them failed.
 */
type FetchRejection = { name?: string; message?: string; cause?: unknown; code?: unknown; errors?: unknown };

/**
 * The exact `TypeError` message each engine words a network failure with. They all raise a `TypeError`,
 * and none of them says which failure it was, so the message is all there is to go on.
 *
 * Node is the odd one out: it words every `fetch()` failure the same way and describes the actual one on
 * the `cause`, so matching its two messages means recognising failures whose code we do not know yet —
 * a certificate that expired, a port the spec forbids. Which is the trade we want: those are
 * still requests that never reached a response, and the alternative is reporting a plain outage as an
 * `UNEXPECTED_ERROR` every time a runtime adds a code to the list below.
 */
const NETWORK_ERROR_MESSAGES = [
  'Failed to fetch', // Chromium
  'Load failed', // WebKit
  'The network connection was lost.', // WebKit
  'network error', // WebKit
  'fetch failed', // Node, the request never got a response
  'terminated', // Node, the connection died while the response was being read
];

/**
 * Gecko words it "NetworkError when attempting to fetch resource.", which reads like something that can
 * be reworded, hence the prefix match.
 */
const NETWORK_ERROR_MESSAGE_PREFIX = 'NetworkError';

/**
 * How deep the `cause` chain is walked looking for the platform code. Node stacks up to two wrappers
 * over the real failure (`TypeError: terminated` → `SocketError`), and anything below that is no longer
 * the rejection describing itself.
 */
const MAX_CAUSE_DEPTH = 3;

/**
 * Names the given rejection as a {@link CcNetworkError} when it is a network failure, `null` otherwise.
 *
 * Call this on the raw rejection, which is the only place the failure is still described: `fetch()`
 * rejects with a `TypeError` whose `cause` carries the platform error, and that description is gone as
 * soon as anything wraps it. Consumers holding an error the client already named want `isNetworkError`
 * from `utils/error-utils.js` instead.
 *
 * Beware that in a browser this covers more than an unreachable server: a rejected CORS preflight, a
 * request blocked by an extension, by mixed content or by a CSP rule all reject the exact same way, and
 * the specification is what makes them indistinguishable — the opacity is the point. So a
 * {@link CcNetworkError} with no {@link CcNetworkError.networkCode} means "the browser refused to say",
 * and retrying it will not fix a misconfiguration.
 *
 * @param error - The rejection to name
 * @param request - The request that failed
 */
export function asNetworkError(error: unknown, request: CcRequest): CcNetworkError | null {
  if (!isFetchNetworkError(error)) {
    return null;
  }

  const cause = (isRejectionObject(error) ? error.cause : null) ?? error;

  return new CcNetworkError(request, getFetchNetworkErrorCode(error), cause);
}

/**
 * Whether the given `fetch()` rejection is a network failure.
 *
 * @param error - The rejection to test
 */
export function isFetchNetworkError(error: unknown): boolean {
  if (getFetchNetworkErrorCode(error) != null) {
    return true;
  }

  if (!isRejectionObject(error) || error.name !== 'TypeError' || typeof error.message !== 'string') {
    return false;
  }

  const message = error.message;

  return NETWORK_ERROR_MESSAGES.includes(message) || message.startsWith(NETWORK_ERROR_MESSAGE_PREFIX);
}

/**
 * The platform code a `fetch()` rejection was raised with, when it is one the client recognises.
 *
 * Where that code sits is up to the runtime: on the rejection itself, on its `cause`, or on one of the
 * `errors` of the `AggregateError` a host resolving to several addresses fails with. So the whole
 * rejection is walked rather than the two places a given runtime happens to use today.
 *
 * @param error - The rejection to read the code from
 * @param depth - How many `cause` hops down the walk already is
 */
function getFetchNetworkErrorCode(error: unknown, depth: number = 0): NetworkErrorCode | null {
  if (!isRejectionObject(error) || depth > MAX_CAUSE_DEPTH) {
    return null;
  }

  if (isNetworkErrorCode(error.code)) {
    return error.code;
  }

  const nested = [error.cause, ...(Array.isArray(error.errors) ? (error.errors as Array<unknown>) : [])];

  for (const nestedError of nested) {
    const code = getFetchNetworkErrorCode(nestedError, depth + 1);
    if (code != null) {
      return code;
    }
  }

  return null;
}

/**
 * Whether the given rejection is worth reading fields off at all.
 *
 * A `fetch()` rejection is normally an `Error`, but nothing stops a runtime — or a mock — from rejecting
 * with a string, or with `null`. Reading `.cause` off those throws, and it would throw from inside the
 * `catch` that is supposed to name the failure, so the caller would get that `TypeError` instead of a
 * `CcRequestError`.
 *
 * @param error - The rejection to test
 */
function isRejectionObject(error: unknown): error is FetchRejection {
  return typeof error === 'object' && error !== null;
}
