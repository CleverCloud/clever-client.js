import type { CcClientConfig, CcClientHooks, CcClientParamsTransformer } from '../types/client.types.ts';
import type { Command } from '../types/command.types.ts';
import type {
  CcRequest,
  CcRequestConfig,
  CcRequestConfigPartial,
  CcRequestParams,
  CcResponse,
} from '../types/request.types.ts';
import type { WithRequired } from '../types/utils.types.ts';
import type { CcAuth } from './auth/cc-auth.ts';
import { type CompositeCommand, isCompositeCommand, type SimpleCommand } from './command/command.ts';
import { CcClientError } from './error/cc-client-errors.ts';
import { handleHttpErrors } from './error/handle-http-errors.ts';
import { QueryParams } from './request/query-params.ts';
import { sendRequest } from './request/request.ts';
import type { CcStream } from './stream/cc-stream.ts';
import type { CcStreamConfig, CcStreamConfigPartial, RetryConfig } from './stream/cc-stream.types.ts';
import type { StreamCommand } from './stream/stream-command.ts';
import {
  getRequestSignal,
  isAbsoluteUrl,
  isUrlWithinBaseUrl,
  mergeRequestConfig,
  mergeRequestConfigPartial,
  pickDefined,
} from './utils.ts';

const DEFAULT_REQUEST_CONFIG: CcRequestConfig = {
  isCorsEnabled: false,
  timeout: 0,
  cache: null,
  isDebugEnabled: false,
};
const DEFAULT_REQUEST_PARAMS: WithRequired<Partial<CcRequestParams>, 'method'> = {
  method: 'GET',
};
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  backoffFactor: 1.25,
  initRetryTimeout: 1_000,
  maxRetryCount: Infinity,
};
const DEFAULT_STREAM_CONFIG: CcStreamConfig = {
  retry: DEFAULT_RETRY_CONFIG,
  // The default Clever Cloud heartbeat period is 2 seconds. We add 500ms to handle potential latency.
  heartbeatPeriod: 2_000 + 500,
  healthcheckInterval: 1_000,
  isDebugEnabled: false,
};

/**
 * CcClient is the main client class for interacting with the Clever Cloud API.
 * It handles HTTP requests, authentication, response processing, and real-time streaming.
 *
 * @template Api - The API type this client targets (e.g., 'cc-api', 'cc-api-bridge')
 *
 * @description
 * The CcClient class provides methods to:
 * - Send commands to the API (both simple and composite)
 * - Create and manage real-time streams (Server-Sent Events)
 * - Handle request/response lifecycle
 * - Manage authentication
 * - Transform request parameters and responses
 * - Handle errors
 *
 * @example
 * ```typescript
 * // Create client configuration
 * const config = {
 *   baseUrl: 'https://api.clever-cloud.com',
 *   defaultRequestConfig: { timeout: 5000 },
 *   defaultStreamsConfig: {
 *     retry: { maxRetryCount: 5, initRetryTimeout: 1000, backoffFactor: 1.25 },
 *     heartbeatPeriod: 2000,
 *     healthcheckInterval: 1000
 *   }
 * };
 *
 * // Initialize authentication and client
 * // (CcAuth, SimpleCommand and StreamCommand are abstract: use concrete subclasses)
 * const auth = new CcAuthApiToken('your-api-token');
 * const client = new CcClient(config, auth);
 *
 * // Send a command
 * const command = new GetApplicationCommand({ applicationId: 'app_123' });
 * const result = await client.send(command);
 *
 * // Create a stream for real-time data
 * const streamCommand = new GetApplicationLogsCommand({ applicationId: 'app_123' });
 * const stream = await client.stream(streamCommand);
 * stream.onLog(log => console.log('Received log:', log));
 * await stream.start();
 * ```
 */
export class CcClient<Api extends string> {
  private _baseUrl: string;
  private _defaultRequestsConfig: CcRequestConfig;
  private _defaultStreamsConfig: CcStreamConfig;
  private _hooks: CcClientHooks;
  private _auth: CcAuth | undefined;
  private _paramsTransformer: CcClientParamsTransformer<Api> | undefined;
  // held weakly, so that remembering an error does not keep it from being collected
  private _reportedErrors = new WeakSet<object>();

  /**
   * Creates a new CcClient instance
   *
   * @param config - Client configuration including baseUrl and default request settings
   * @param auth - Optional authentication handler
   * @param paramsTransformer - Optional transformation of the command params, for the clients built on
   * top of this one. Without it, the params are sent as the command holds them.
   */
  constructor(config: CcClientConfig, auth?: CcAuth, paramsTransformer?: CcClientParamsTransformer<Api>) {
    try {
      new URL(config.baseUrl, globalThis.location?.href);
    } catch (e) {
      throw new CcClientError(`Invalid configuration key: "baseUrl=${config.baseUrl}"`, 'INVALID_CONFIGURATION', e);
    }
    this._baseUrl = config.baseUrl;
    this._defaultRequestsConfig = mergeRequestConfig(DEFAULT_REQUEST_CONFIG, config.defaultRequestConfig);
    this._defaultStreamsConfig = mergeStreamConfig(DEFAULT_STREAM_CONFIG, config.defaultStreamConfig);
    this._hooks = config.hooks ?? {};
    this._auth = auth;
    this._paramsTransformer = paramsTransformer;
  }

  /**
   * Sends a command to the API and processes the response
   *
   * @param command - The command to execute
   * @param requestConfig - Optional request configuration that overrides the default
   * @returns The processed command response
   * @throws {CcClientError} When there's a client-side error
   * @throws {CcHttpError} When there's a server-side error
   */
  async send<CommandInput, CommandOutput>(
    command: Command<Api, CommandInput, CommandOutput>,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<CommandOutput> {
    try {
      return await this._send(command, requestConfig, true);
    } catch (e) {
      this._reportError(e, requestConfig);
      throw e;
    }
  }

  /**
   * Hands the error rejecting a `send()` to the `onError` hook, unless there is nothing to report.
   *
   * Reported from `send()` rather than from `#send`, which composers go through too: a composite would
   * report an inner error once per level, and even an error it recovered from.
   *
   * @param error - The error rejecting `send()`
   * @param requestConfig - The request configuration `send()` was called with
   */
  private _reportError(error: unknown, requestConfig: CcRequestConfigPartial | undefined): void {
    if (this._hooks.onError == null) {
      return;
    }

    // an abort is what the caller asked for, not a failure to report
    if (getRequestSignal(requestConfig, this._defaultRequestsConfig)?.aborted === true) {
      return;
    }

    // an error can reject several `send()` calls, and only the first reports it: nested ones, like the id
    // resolution preparing a command, or concurrent ones sharing a fetch that failed, like the dedupe does
    if (typeof error === 'object' && error !== null) {
      if (this._reportedErrors.has(error)) {
        return;
      }
      this._reportedErrors.add(error);
    }

    void this._hooks.onError(error);
  }

  /**
   * Sends a command, under the idempotency ceiling of whatever encloses it.
   *
   * Every command goes through here, including the ones a composite command sends through its composer.
   *
   * @param command - The command to execute
   * @param requestConfig - Request configuration that overrides the default
   * @param isIdempotentCeiling - Whether what encloses this command can be replayed at all
   * @returns The processed command response
   */
  private async _send<CommandInput, CommandOutput>(
    command: Command<Api, CommandInput, CommandOutput>,
    requestConfig: CcRequestConfigPartial | undefined,
    isIdempotentCeiling: boolean,
  ): Promise<CommandOutput> {
    if (isCompositeCommand(command)) {
      return this._compose(command, requestConfig, isIdempotentCeiling);
    }

    const requestParams = await this._getCommandRequestParams(command, requestConfig);
    // a caller can only replay what it sent, so a command is no more replayable than what encloses it
    const isIdempotent = isIdempotentCeiling && command.isIdempotent();
    const request = await this._prepareRequest(command, requestParams, requestConfig, isIdempotent);
    const response = await sendRequest<CommandOutput>(request);
    return this._handleResponse(response, request, command);
  }

  /**
   * Creates and returns a stream based on the provided command.
   *
   * @param command - The stream command to execute
   * @param requestAndStreamConfig - Optional stream and request configuration that overrides the default
   * @returns A promise that resolves to the created stream
   */
  async stream<CommandInput, Stream extends CcStream>(
    command: StreamCommand<Api, CommandInput, Stream>,
    requestAndStreamConfig?: CcStreamConfigPartial & CcRequestConfigPartial,
  ): Promise<Stream> {
    const transformedParams = (await this._transformParams(command, requestAndStreamConfig)) as CommandInput;

    const streamConfigWithDefaults = mergeStreamConfig(this._defaultStreamsConfig, requestAndStreamConfig);
    return command.createStream(async () => {
      const preparedRequestParams = await command.toRequestParams(transformedParams);
      return this._prepareRequest(command, preparedRequestParams, requestAndStreamConfig, true);
    }, streamConfigWithDefaults);
  }

  /**
   * Transforms the params of a command, simple, composite or stream, with the params transformer of the
   * client, if any.
   *
   * @param command - The command whose params need transformation
   * @param requestConfig - The request configuration the command is sent with
   * @returns The transformed params
   */
  private _transformParams(
    command: Command<Api, unknown, unknown> | StreamCommand<Api, unknown, CcStream>,
    requestConfig: CcRequestConfigPartial | undefined,
  ): Promise<unknown> {
    if (this._paramsTransformer == null) {
      return Promise.resolve(command.params);
    }
    return this._paramsTransformer.transformParams(command, requestConfig);
  }

  /**
   * Handles execution of composite commands that consist of multiple sub-commands
   *
   * @param command - The composite command to execute
   * @param requestConfig - Request configuration that overrides the default
   * @param isIdempotentCeiling - Whether what encloses this composite command can be replayed at all
   * @returns The result of executing all sub-commands
   */
  private async _compose<CommandOutput>(
    command: CompositeCommand<Api, unknown, CommandOutput>,
    requestConfig: CcRequestConfigPartial | undefined,
    isIdempotentCeiling: boolean,
  ): Promise<CommandOutput> {
    const transformedParams = await this._transformParams(command, requestConfig);

    // the composite command states the configuration its sub-commands need, the caller configuration still wins over it
    const composedRequestConfig = mergeRequestConfigPartial(command.getRequestConfig(), requestConfig);

    // a caller can only replay the composite as a whole, so nothing it sends is more replayable than it is
    const composedIsIdempotent = isIdempotentCeiling && command.isIdempotent();

    return command.compose(transformedParams, {
      send: (command, commandRequestConfig) =>
        this._send(
          command,
          mergeRequestConfigPartial(composedRequestConfig, commandRequestConfig),
          composedIsIdempotent,
        ),
    });
  }

  /**
   * Prepares request parameters for a simple command
   *
   * @param command - The command to prepare parameters for
   * @param requestConfig - Request configuration that overrides the default
   * @returns The prepared request parameters
   */
  private async _getCommandRequestParams(
    command: SimpleCommand<Api, unknown, unknown>,
    requestConfig: CcRequestConfigPartial | undefined,
  ): Promise<Partial<CcRequestParams>> {
    const transformedParams = await this._transformParams(command, requestConfig);
    return command.toRequestParams(transformedParams);
  }

  /**
   * Prepares the final request by combining parameters, configuration, and authentication
   *
   * @param command - The command to prepare request for
   * @param requestParams - The request parameters
   * @param requestConfig - Request configuration that overrides the default
   * @param isIdempotent - Whether sending the prepared request twice means it twice
   * @returns The prepared request
   */
  private async _prepareRequest(
    command: SimpleCommand<Api, unknown, unknown> | StreamCommand<Api, unknown, CcStream>,
    requestParams: Partial<CcRequestParams>,
    requestConfig: CcRequestConfigPartial | undefined,
    isIdempotent: boolean,
  ): Promise<CcRequest> {
    const preparedRequestParams: WithRequired<Partial<CcRequestParams>, 'queryParams' | 'headers'> = {
      ...requestParams,
      headers: requestParams.headers ?? new Headers(),
      queryParams: requestParams.queryParams ?? new QueryParams(),
    };

    // apply hook
    if (this._hooks.onRequest != null) {
      await this._hooks.onRequest(preparedRequestParams);
    }

    const url = this._resolveUrl(preparedRequestParams.url ?? '');

    // apply auth if auth method is defined, if command does not disable it,
    // and if the command does not target a URL outside of the client base URL
    if (command.isAuthEnabled() && isUrlWithinBaseUrl(this._baseUrl, url)) {
      this._auth?.applyOnRequestParams(preparedRequestParams);
    }

    // the command states the configuration its endpoint needs, the caller configuration still wins over it
    const resolvedRequestConfig = mergeRequestConfigPartial(command.getRequestConfig(), requestConfig);

    return {
      // params
      ...DEFAULT_REQUEST_PARAMS,
      ...preparedRequestParams,
      // config
      ...mergeRequestConfig(this._defaultRequestsConfig, resolvedRequestConfig),
      // url
      url,
      // metadata
      isIdempotent,
    };
  }

  /**
   * Processes the API response and transforms it according to the command's requirements
   *
   * @param response - The response
   * @param request - The request
   * @param command - The command that generated the response
   * @returns The processed response
   * @throws {CcClientError} When there's a client-side error processing the response
   * @throws {CcHttpError} When the server returns an error response
   */
  private async _handleResponse<CommandOutput>(
    response: CcResponse<CommandOutput>,
    request: CcRequest,
    command: SimpleCommand<Api, unknown, CommandOutput>,
  ): Promise<CommandOutput> {
    // apply hook
    if (this._hooks.onResponse != null) {
      await this._hooks.onResponse(response, request);
    }

    // handle http errors
    handleHttpErrors(request, response, command);

    return command.transformCommandOutput(response.body);
  }

  /**
   * Resolves a command URL against the client base URL.
   * Absolute URLs (starting with `http://` or `https://`) are returned untouched so that a command can target
   * another origin than the one the client is configured with.
   *
   * @param url - The URL provided by the command, either absolute or relative to the base URL
   * @returns The resolved URL
   */
  private _resolveUrl(url: string): string {
    if (isAbsoluteUrl(url)) {
      return url;
    }

    const left = this._baseUrl.endsWith('/') ? this._baseUrl.slice(0, -1) : this._baseUrl;
    const right = url.startsWith('/') ? url : '/' + url;

    return left + right;
  }
}

function mergeStreamConfig(baseConfig: CcStreamConfig, config?: CcStreamConfigPartial): CcStreamConfig {
  // an `undefined` option counts as an absent option, like in `mergeRequestConfig`
  const overrideConfig: CcStreamConfigPartial = pickDefined(config ?? {});

  return {
    ...baseConfig,
    ...overrideConfig,
    retry: mergeRetry(baseConfig.retry, overrideConfig.retry),
  };
}

function mergeRetry(baseRetry: RetryConfig | null, retry: Partial<RetryConfig> | null | undefined): RetryConfig | null {
  if (retry === undefined) {
    return baseRetry;
  }
  // `null` disables retries, it does not mean "keep the base retry config"
  if (retry === null) {
    return null;
  }
  // re-enabling retries disabled by the base config starts from the default values
  return { ...(baseRetry ?? DEFAULT_RETRY_CONFIG), ...pickDefined(retry) };
}
