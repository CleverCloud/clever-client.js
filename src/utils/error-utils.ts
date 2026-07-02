import { CcClientError, CcHttpError, CcRequestError } from '../lib/error/cc-client-errors.js';

export function isCcClientError(error: unknown): error is CcClientError {
  return error instanceof CcClientError;
}

export function isCcRequestError(error: unknown): error is CcRequestError {
  return error instanceof CcRequestError;
}

export function isCcHttpError(error: unknown): error is CcHttpError {
  return error instanceof CcHttpError;
}
