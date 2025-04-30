import type { CcRequest, CcRequestParams, CcResponse } from './request.types.js';
import type { SelfOrPromise, WithRequired } from './utils.types.js';

/**
 * Hook function type for modifying request parameters before a request is sent.
 * Can be used to add headers, modify query parameters, or transform the request in any way.
 *
 * @param request - The original request parameters to be modified
 * @returns void (can be returned directly or as a Promise)
 */
export type OnRequestHook = (
  request: WithRequired<Partial<CcRequestParams>, 'queryParams', 'headers'>,
) => SelfOrPromise<void>;

/**
 * Hook function type for processing successful responses before they're returned to the caller.
 * Can be used for logging, metrics collection, or response transformation.
 *
 * @template CommandOutput - The expected type of the response data
 * @param response - The response object containing status, headers, and data
 * @returns void (can be returned directly or as a Promise)
 */
export type OnResponseHook = <CommandOutput>(
  response: CcResponse<CommandOutput>,
  request: CcRequest,
) => SelfOrPromise<void>;

/**
 * Hook function type for handling errors that occur during request processing.
 * Can be used for error logging, error transformation, or recovery attempts.
 *
 * @param error - The error that occurred during request processing
 * @returns void (can be returned directly or as a Promise)
 */
export type OnErrorHook = (error: any) => SelfOrPromise<void>;
