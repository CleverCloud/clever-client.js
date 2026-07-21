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
    const parsedErrorMessage = parseErrorMessage(response);
    const parsedErrorCode = parseErrorCode(response);

    const errorMessage =
      parsedErrorMessage == null || parsedErrorMessage.length === 0
        ? `Error ${response.status}`
        : `[${response.status}]: ${parsedErrorMessage}`;
    // rate limiting is a cross-cutting, transport-level concern: report it with a single,
    // predictable code instead of leaving it to each command's own error-code mapping
    const errorCode = isRateLimitResponse(response, parsedErrorCode)
      ? TOO_MANY_REQUESTS_ERROR_CODE
      : transformErrorCode(parsedErrorCode, command);

    // throw error
    throw new CcHttpError(errorMessage, errorCode, request, response);
  }
}

function parseErrorMessage(response: CcResponse<unknown>): string | undefined {
  const body = response.body;
  if (typeof body === 'string') {
    return body;
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

function parseErrorCode(response: CcResponse<unknown>): string | undefined {
  const body = response.body as { code?: string | number; id?: string | number } | undefined;
  if (body?.code != null) {
    return String(body.code);
  }
  if (body?.id != null) {
    return String(body.id);
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

function transformErrorCode(errorCode: string | undefined, command?: SimpleCommand<string, unknown, unknown>): string {
  if (errorCode == null || command == null) {
    return 'unknown_error';
  }
  return command.transformErrorCode(errorCode);
}
