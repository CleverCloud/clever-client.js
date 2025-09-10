import type { QueryParams } from '../lib/request/query-params.js';

/**
 * Complete request configuration combining both request parameters and configuration options.
 * This is the final request object that will be processed by the client.
 */
export type CcRequest = CcRequestParams & CcRequestConfig;

/**
 * Core request parameters that define what and how to send the request.
 */
export interface CcRequestParams {
  /**
   * The HTTP method to use for the request
   */
  method: HttpMethod;

  /**
   * The URL to send the request to.
   * It is relative to the client's base URL
   */
  url: string;

  /**
   * HTTP headers to include with the request
   */
  headers?: Headers;

  /**
   * Query parameters to append to the URL
   * Will be properly encoded and added to the URL
   */
  queryParams?: QueryParams;

  /**
   * Optional request body
   * Can be a string, object (will be JSON-stringified), or Blob
   */
  body?: RequestBody;
}

/**
 * Configuration options that control how the request is processed.
 */
export interface CcRequestConfig {
  /**
   * Whether to enable CORS for the request
   */
  cors: boolean;

  /**
   * Request timeout in milliseconds
   * Set to 0 for no timeout
   */
  timeout: number;

  /**
   * Cache behaviour for the request
   */
  cache: RequestCachePolicy | null;

  /**
   * Optional AbortSignal for cancelling the request
   */
  signal?: AbortSignal;

  /**
   * Debug configuration for request/response logging
   */
  debug: boolean;
}

export interface CcRequestConfigPartial extends Partial<CcRequestConfig> {
  cache?: Partial<RequestCachePolicy> | null;
}

/**
 * Response object returned by the API client.
 *
 * @template CommandOutput - The expected type of the response body
 */
export interface CcResponse<CommandOutput> {
  /**
   * HTTP status code of the response
   */
  status: number;

  /**
   * Response headers
   */
  headers: Headers;

  /**
   * Parsed response body
   */
  body: CommandOutput;

  /**
   * The duration of the request in milliseconds
   */
  requestDuration: number;

  /**
   * Whether the response was retrieved from the cache
   */
  cacheHit: boolean;
}

/**
 * Valid types for request body data.
 */
export type RequestBody = string | Object | Blob;

/**
 * Function type for adapters that handle the actual sending of requests.
 * Allows different implementations for different environments (browser, node, etc).
 *
 * @template CommandOutput - The expected type of the response body
 */
export type RequestAdapter = <CommandOutput>(request: CcRequest) => Promise<CcResponse<CommandOutput>>;

/**
 * Function type for request middleware that can wrap the request handling process.
 * Used for adding functionality like caching, debugging, or error handling.
 *
 * @template CommandOutput - The expected type of the response body
 */
export type RequestWrapper = <CommandOutput>(
  request: CcRequest,
  handler: RequestAdapter,
) => Promise<CcResponse<CommandOutput>>;

/**
 * Supported HTTP methods for API requests.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

/**
 * Valid types for query parameter values.
 * These values will be properly encoded when added to the URL.
 */
export type QueryParamValue = string | number | boolean | null;

export type RequestCachePolicy = {
  /**
   * Time in milliseconds that cached responses remain in cache
   */
  ttl: number;
  /**
   * Cache behaviour
   * - 'reload': Force network fetch and update cache
   */
  mode?: 'reload';
};
