import type { CcRequest, CcResponse } from '../../types/request.types.js';
import type { SimpleCommand } from '../command/command.js';
import { CcHttpError } from './cc-client-errors.js';

/**
 * Error code reported for any rate-limited request, regardless of which backend produced it.
 * This is the wire code already used natively by v4/OVD-backed endpoints; legacy v2 (cc-api)
 * rate-limit responses are normalized to it as well, see {@link isRateLimitResponse}.
 */
export const TOO_MANY_REQUESTS_ERROR_CODE = 'clever.core.too-many-requests';

/**
 * Error code reported for a payload the backend rejected as invalid, regardless of which backend
 * produced it. Like {@link TOO_MANY_REQUESTS_ERROR_CODE} this is the wire code v4/OVD-backed
 * endpoints already send natively; notification-api describes the same failure with no code at all,
 * and is normalized to it, see {@link isFieldErrorsResponse}.
 */
export const BAD_REQUEST_ERROR_CODE = 'clever.core.bad-request';

export function handleHttpErrors(
  request: CcRequest,
  response: CcResponse<unknown>,
  command?: SimpleCommand<string, unknown, unknown>,
): void {
  if (response.status >= 400) {
    // try to parse message and code from error
    const errorBody = parseErrorBody(response.body);
    const fieldErrorsMessage = parseFieldErrorsMessage(errorBody);
    const parsedErrorMessage = parseErrorMessage(errorBody) ?? fieldErrorsMessage;
    const parsedErrorCode = parseErrorCode(errorBody);

    const errorMessage =
      parsedErrorMessage == null || parsedErrorMessage.length === 0
        ? `Error ${response.status}`
        : `[${response.status}]: ${parsedErrorMessage}`;
    const errorCode = resolveErrorCode(response, parsedErrorCode, parsedErrorMessage, fieldErrorsMessage, command);

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

/**
 * The message of a Play JSON validation failure, in the shape `JsError.toJson` produces.
 *
 * notification-api answers a malformed payload with that document and nothing else: no `message` and
 * no `code`, just a map of the paths that failed to the reasons they failed.
 *
 * ```json
 * { "obj.urls": [{ "msg": ["error.path.missing"], "args": [] }] }
 * ```
 *
 * Left alone it reads as a bare `Error 400`, which doesn't say which field the caller got wrong.
 * This flattens it to `urls: error.path.missing`, dropping the `obj` prefix play-json uses to name
 * the root of the payload — it names our own request body, so it tells the caller nothing.
 *
 * Every entry has to match that shape for the body to be reported this way, which is what keeps an
 * unrelated document from being read as a list of field errors.
 */
function parseFieldErrorsMessage(body: unknown): string | undefined {
  if (body == null || typeof body !== 'object' || Array.isArray(body)) {
    return undefined;
  }

  const entries = Object.entries(body as Record<string, unknown>);
  if (entries.length === 0) {
    return undefined;
  }

  const fieldErrors: Array<string> = [];
  for (const [path, pathErrors] of entries) {
    if (!Array.isArray(pathErrors)) {
      return undefined;
    }

    const reasons = (pathErrors as Array<{ msg?: Array<unknown> } | null>)
      .flatMap((pathError) => {
        const messages = pathError?.msg;
        return Array.isArray(messages) ? messages : [];
      })
      .filter((reason: unknown): reason is string => typeof reason === 'string');

    if (reasons.length === 0) {
      return undefined;
    }

    fieldErrors.push(`${path.startsWith('obj.') ? path.slice('obj.'.length) : path}: ${reasons.join(', ')}`);
  }

  return fieldErrors.join('. ');
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

/**
 * The code to report for an error response: one of the cross-cutting codes the client normalizes
 * itself, or the code the body carried once the command had its say on it.
 *
 * A backend reporting a cross-cutting failure in its own dialect is a transport-level concern, not
 * something to leave to each command's error-code mapping — so those are resolved here, and a
 * command never gets to override them.
 */
function resolveErrorCode(
  response: CcResponse<unknown>,
  parsedErrorCode: string | undefined,
  parsedErrorMessage: string | undefined,
  fieldErrorsMessage: string | undefined,
  command?: SimpleCommand<string, unknown, unknown>,
): string {
  if (isRateLimitResponse(response, parsedErrorCode)) {
    return TOO_MANY_REQUESTS_ERROR_CODE;
  }
  if (isFieldErrorsResponse(response, parsedErrorCode, fieldErrorsMessage)) {
    return BAD_REQUEST_ERROR_CODE;
  }
  return transformErrorCode(parsedErrorCode, parsedErrorMessage, response.status, command);
}

/**
 * Whether the response is a payload validation failure reported without an error code.
 *
 * notification-api answers a malformed payload with the bare play-json document
 * {@link parseFieldErrorsMessage} reads, which names the fields at fault but carries no code — so a
 * caller had nothing to match on, where every other backend sends {@link BAD_REQUEST_ERROR_CODE} (or
 * its own spelling of it) for the same failure. Reporting that code here closes the gap.
 *
 * The body having been recognized is most of the answer; the status is checked too so that the same
 * document returned with another status is never labelled a bad request. A body that did carry a
 * code is left alone — it says more than this one would, and the command may still map it.
 */
function isFieldErrorsResponse(
  response: CcResponse<unknown>,
  parsedErrorCode: string | undefined,
  fieldErrorsMessage: string | undefined,
): boolean {
  return fieldErrorsMessage != null && parsedErrorCode == null && response.status === 400;
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
