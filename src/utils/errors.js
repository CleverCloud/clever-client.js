import { CcClientError, CcHttpError, CcRequestError } from '../lib/error/cc-client-errors.js';

/**
 * @param {any} error
 * @returns {error is CcClientError}
 */
export function isCcClientError(error) {
  return error instanceof CcClientError;
}

/**
 * @param {any} error
 * @returns {error is CcRequestError}
 */
export function isCcRequestError(error) {
  return error instanceof CcRequestError;
}

/**
 * @param {any} error
 * @returns {error is CcHttpError}
 */
export function isCcHttpError(error) {
  return error instanceof CcHttpError;
}
