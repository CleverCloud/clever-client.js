import type { CcStream } from '../lib/stream/cc-stream.js';
import type { CcStreamConfigPartial } from '../lib/stream/cc-stream.types.js';
import type { StreamCommand } from '../lib/stream/stream-command.js';
import type { Command } from './command.types.js';
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
   * Default configuration applied to all streams created by the client.
   * Individual streams can override these settings.
   */
  defaultStreamConfig?: CcStreamConfigPartial;

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
   * Not called when the request is aborted through its `signal`.
   * Called once per error, even when it rejects several `send()` calls, nested or concurrent.
   */
  onError?: OnErrorHook;
}

/**
 * Transforms the params of a command before the client turns them into a request: what a client
 * built on top of `CcClient` plugs in to adapt the commands of its API, like resolving ids.
 *
 * @template Api - The API type the client targets
 */
export interface CcClientParamsTransformer<Api extends string> {
  /**
   * Transforms the params of a command, simple, composite or stream.
   *
   * @param command - The command whose params are transformed
   * @param requestConfig - The request configuration the command is sent with
   * @returns The transformed params
   */
  transformParams(
    command: Command<Api, unknown, unknown> | StreamCommand<Api, unknown, CcStream>,
    requestConfig: CcRequestConfigPartial | undefined,
  ): Promise<unknown>;
}
