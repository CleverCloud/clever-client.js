import type { CcRequest, CcResponse } from '../../types/request.types.js';
import type { SimpleCommand } from '../command/command.js';
import { CcHttpError } from './cc-client-errors.js';

/**
 * Error code reported for any rate-limited request, regardless of which backend produced it.
 * This is the wire code already used natively by v4/OVD-backed endpoints; legacy v2 (cc-api)
 * rate-limit responses are normalized to it as well, see {@link isRateLimitResponse}.
 */
export const TOO_MANY_REQUESTS_ERROR_CODE = 'clever.core.too-many-requests';

export function handleHttpErrors(
  request: CcRequest,
  response: CcResponse<unknown>,
  command?: SimpleCommand<string, unknown, unknown>,
): void {
  if (response.status >= 400) {
    // try to parse message and code from error
    const errorBody = parseErrorBody(response.body);
    const parsedErrorMessage = parseErrorMessage(errorBody);
    const parsedErrorCode = parseErrorCode(errorBody);

    const errorMessage =
      parsedErrorMessage == null || parsedErrorMessage.length === 0
        ? `Error ${response.status}`
        : `[${response.status}]: ${parsedErrorMessage}`;
    // rate limiting is a cross-cutting, transport-level concern: report it with a single,
    // predictable code instead of leaving it to each command's own error-code mapping
    const errorCode = isRateLimitResponse(response, parsedErrorCode)
      ? TOO_MANY_REQUESTS_ERROR_CODE
      : transformErrorCode(parsedErrorCode, parsedErrorMessage, response.status, command);

    // throw error
    throw new CcHttpError(errorMessage, errorCode, request, response);
  }
}

/**
 * The body of an error response, with a JSON document sent as text parsed back into an object.
 *
 * Some endpoints answer with JSON but leave the content type at `text/plain`: Play does it for every
 * `String` result, which is how notification-api reports a missing hook, and it is also how it
 * forwards cc-api's own error bodies on an authentication failure. `getResponseBody()` keys the
 * parsing off the content type, so those reach us as a raw string — leaving them that way would put
 * a JSON document in the user-facing message and drop the error code the body was carrying.
 *
 * Anything that isn't a JSON object is returned untouched: a genuine plain-text error still reads
 * best as the text it is, and {@link parseErrorMessage} reports it as such.
 */
function parseErrorBody(body: unknown): unknown {
  // only an object can hold the fields we look for, so this both skips the parsing attempt for the
  // plain-text and HTML bodies a gateway returns, and makes a successful parse an object for sure
  if (typeof body !== 'string' || !body.trimStart().startsWith('{')) {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

function parseErrorMessage(body: unknown): string | undefined {
  if (typeof body === 'string') {
    return isMarkupDocument(body) ? undefined : body;
  }

  const errorBody = body as { message?: unknown; error?: unknown } | undefined;
  if (typeof errorBody?.message === 'string') {
    return errorBody.message;
  }
  if (typeof errorBody?.error === 'string') {
    return errorBody.error;
  }

  return undefined;
}

/**
 * Whether the body is a markup document rather than a message.
 *
 * A request that fails before it reaches the API is answered by whatever sits in front of it: a
 * gateway timing out on a 502 or a 503 replies with an HTML page, and some proxies reply with an XML
 * document. Neither holds a sentence worth showing, so reporting the body as the message puts a
 * whole document where the caller expects one line.
 *
 * Left out, the message falls back to `Error <status>`, which is what those responses actually mean.
 * Nothing is lost either way: the document stays on the response the {@link CcHttpError} carries.
 */
function isMarkupDocument(body: string): boolean {
  return body.trimStart().startsWith('<');
}

function parseErrorCode(body: unknown): string | undefined {
  const errorBody = body as { code?: string | number; id?: string | number } | undefined;
  if (errorBody?.code != null) {
    return String(errorBody.code);
  }
  if (errorBody?.id != null) {
    return String(errorBody.id);
  }

  return undefined;
}

function isRateLimitResponse(response: CcResponse<unknown>, parsedErrorCode: string | undefined): boolean {
  // v4 endpoints (and a few legacy ones) use the standard "Too Many Requests" status
  if (response.status === 429) {
    return true;
  }
  // Most legacy v2 (cc-api) endpoints report rate limiting as a 403 response whose body `id` is
  // (coincidentally) also 403 — that numeric id identifies the `RATE_LIMIT_HIT` error specifically,
  // it isn't derived from the HTTP status, and no other cc-api error uses it.
  return response.status === 403 && parsedErrorCode === '403';
}

function transformErrorCode(
  errorCode: string | undefined,
  errorMessage: string | undefined,
  status: number,
  command?: SimpleCommand<string, unknown, unknown>,
): string {
  if (errorCode == null || command == null) {
    return 'unknown_error';
  }
  return command.transformErrorCode({ code: errorCode, message: errorMessage, status });
}
