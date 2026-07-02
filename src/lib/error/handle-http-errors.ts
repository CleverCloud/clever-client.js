import type { CcRequest, CcResponse } from '../../types/request.types.js';
import type { SimpleCommand } from '../command/command.js';
import { CcHttpError } from './cc-client-errors.js';

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
    // eventually ask command to transform error code
    const errorCode = transformErrorCode(parsedErrorCode, command);

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

function transformErrorCode(errorCode: string | undefined, command?: SimpleCommand<string, unknown, unknown>): string {
  if (errorCode == null || command == null) {
    return 'unknown_error';
  }
  return command.transformErrorCode(errorCode);
}
