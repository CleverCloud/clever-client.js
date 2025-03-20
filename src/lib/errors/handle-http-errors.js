import { CcHttpError } from './cc-client-errors.js';

/**
 * @typedef {import('../../types/request.types.js').CcResponse<?>} Response
 */

/**
 * @param {Response} response
 * @returns {void}
 */
export function handleHttpErrors(response) {
  if (response.status >= 400) {
    const responseBody = response.body;
    const errorMessage = getErrorMessage(responseBody);
    throw new CcHttpError(errorMessage, response);
    // NOTE: This is only for legacy todo: do we still need that?
    // if (responseBody.id != null) {
    //   error.id = responseBody.id;
    // }
  }
}

// todo: normalize error message body
//  API do not normalize errors (yet?) but work is in progress
//  Can we do a best effort on trying to normalize it on client side?

/**
 *
 * @param {null|string|{message?: string, error?: string}} responseBody
 * @returns {string}
 */
function getErrorMessage(responseBody) {
  if (typeof responseBody === 'string') {
    return responseBody;
  }
  if (typeof responseBody?.message === 'string') {
    return responseBody.message;
  }
  if (typeof responseBody?.error === 'string') {
    return responseBody.error;
  }

  return 'Unknown error';
}
