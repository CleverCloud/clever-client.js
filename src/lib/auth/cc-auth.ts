import type { CcRequestParams } from '../../types/request.types.js';
import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * Abstract base class for Clever Cloud authentication mechanisms.
 * Provides a common interface for different authentication strategies
 * including API tokens and OAuth.
 *
 * This class defines the contract for:
 * - Applying authentication to request parameters
 * - Retrieving authentication tokens
 */
export abstract class CcAuth {
  /**
   * Applies authentication headers to request parameters.
   * Adds an Authorization header with the authentication token.
   *
   * @param requestParams - The request parameters to modify
   */
  applyOnRequestParams(requestParams: Partial<CcRequestParams>): void {
    requestParams.headers = new HeadersBuilder(requestParams.headers).authorization(this.getAuthorization()).build();
  }

  /**
   * Returns the authentication token in the appropriate format for the auth strategy.
   * Must be implemented by concrete authentication classes.
   *
   * @returns The formatted authentication token
   */
  abstract getAuthorization(): string;
}
