/**
 * @import { CcResponse } from '../../types/request.types.js'
 */
import { CcHttpError } from './cc-client-errors.js';

/**
 * @param {CcResponse<?>} response
 * @returns {void}
 */
export function handleHttpErrors(response) {
  if (response.status >= 400) {
    const errorMessage = getErrorMessage(response);
    // todo: should be done by debug logger ?
    console.log(response);
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
 * @param {CcResponse<?>} response
 * @returns {string}
 */
function getErrorMessage(response) {
  if (typeof response.body === 'string') {
    return response.body;
  }
  if (typeof response.body?.message === 'string') {
    return response.body.message;
  }
  if (typeof response.body?.error === 'string') {
    return response.body.error;
  }

  return `Error ${response.status}`;
}
