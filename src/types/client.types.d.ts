import type { OnErrorHook, OnRequestHook, OnResponseHook } from './hook.types.js';
import type { CcRequestConfigPartial } from './request.types.js';

/**
 * Configuration options for initialising a Clever Cloud API client.
 */
export type CcClientConfig = {
  /**
   * The base URL of the Clever Cloud API.
   * All request paths will be relative to this URL.
   *
   * @example 'https://api.example.com'
   */
  baseUrl: string;

  /**
   * Default configuration applied to all requests made by the client.
   * Individual requests can override these settings.
   */
  defaultRequestConfig?: CcRequestConfigPartial;

  /**
   * Optional hooks for customising client behaviour.
   * These hooks allow intercepting and modifying requests and responses.
   */
  hooks?: CcClientHooks;
};

/**
 * Hook functions that can be used to customise the client's request/response lifecycle.
 * All hooks are optional and allow modifying the default behaviour of the client.
 */
export interface CcClientHooks {
  /**
   * Hook called before a request is sent.
   * Allows modifying the request parameters before they are used.
   */
  onRequest?: OnRequestHook;

  /**
   * Hook called after receiving a successful response.
   * Allows processing or transforming the response before it's returned.
   */
  onResponse?: OnResponseHook;

  /**
   * Hook called when an error occurs during a request.
   * Allows custom error handling or error transformation.
   */
  onError?: OnErrorHook;
}
