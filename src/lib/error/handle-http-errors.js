/**
 * @import { CcResponse } from '../../types/request.types.js'
 * @import { SimpleCommand } from '../command/command.js'
 */
import { CcHttpError } from './cc-client-errors.js';

/**
 * @param {CcResponse<?>} response
 * @param {SimpleCommand<?, ?, ?>} command
 * @returns {void}
 */
export function handleHttpErrors(response, command) {
  if (response.status >= 400) {
    // try to parse message and code from error
    const parsedErrorMessage = parseErrorMessage(response);
    const parsedErrorCode = parseErrorCode(response);

    const errorMessage =
      parsedErrorMessage == null || parsedErrorMessage.length === 0
        ? `Error ${response.status}`
        : `[${response.status}]: ${parsedErrorMessage}`;
    // ask command to transform error code
    const errorCode = parsedErrorCode == null ? null : command.transformErrorCode(parsedErrorCode);

    // throw error
    throw new CcHttpError(errorMessage, errorCode, response);
  }
}

/**
 * @param {CcResponse<?>} response
 * @returns {string|null}
 */
function parseErrorMessage(response) {
  if (typeof response.body === 'string') {
    return response.body;
  }
  if (typeof response.body?.message === 'string') {
    return response.body.message;
  }
  if (typeof response.body?.error === 'string') {
    return response.body.error;
  }

  return null;
}

/**
 * @param {CcResponse<?>} response
 * @returns {string|null}
 */
function parseErrorCode(response) {
  if (response.body?.code != null) {
    return String(response.body.code);
  }
  if (response.body?.id != null) {
    return String(response.body.id);
  }

  return null;
}
