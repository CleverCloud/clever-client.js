import type { CcClientConfig, CcClientHooks } from '../types/client.types.js';
import type { Command } from '../types/command.types.js';
import type {
  CcRequest,
  CcRequestConfig,
  CcRequestConfigPartial,
  CcRequestParams,
  CcResponse,
  HttpMethod,
} from '../types/request.types.js';
import type { WithRequired } from '../types/utils.types.js';
import type { CcAuth } from './auth/cc-auth.js';
import { CompositeCommand, type SimpleCommand } from './command/command.js';
import { handleHttpErrors } from './error/handle-http-errors.js';
import type { GetUrl } from './get-url.js';
import { QueryParams } from './request/query-params.js';
import { sendRequest } from './request/request.js';
import type { CcStream } from './stream/cc-stream.js';
import type { CcStreamConfig, CcStreamConfigPartial } from './stream/cc-stream.types.js';
import type { StreamCommand } from './stream/stream-command.js';
import { mergeRequestConfig, mergeRequestConfigPartial } from './utils.js';

const DEFAULT_REQUEST_CONFIG: CcRequestConfig = {
  cors: false,
  timeout: 0,
  cache: null,
  debug: false,
};
const DEFAULT_REQUEST_PARAMS: Partial<CcRequestParams> & { method: HttpMethod } = {
  method: 'GET',
};
const DEFAULT_STREAM_CONFIG: CcStreamConfig = {
  retry: {
    backoffFactor: 1.25,
    initRetryTimeout: 1_000,
    maxRetryCount: Infinity,
  },
  // The default Clever Cloud heartbeat period is 2 seconds. We add 500ms to handle potential latency.
  heartbeatPeriod: 2_000 + 500,
  healthcheckInterval: 1_000,
  debug: false,
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
 * - Handle errors and empty responses
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
 * const auth = new CcAuth();
 * const client = new CcClient(config, auth);
 *
 * // Send a command
 * const command = new SimpleCommand();
 * const result = await client.send(command);
 *
 * // Create a stream for real-time data
 * const streamCommand = new StreamCommand();
 * const stream = await client.stream(streamCommand);
 * stream.onLog(log => console.log('Received log:', log));
 * await stream.start();
 * ```
 */
export class CcClient<Api extends string> {
  #baseUrl: string;
  #defaultRequestsConfig: CcRequestConfig;
  #defaultStreamsConfig: CcStreamConfig;
  #hooks: CcClientHooks;
  #auth: CcAuth | null;

  /**
   * Creates a new CcClient instance
   *
   * @param config - Client configuration including baseUrl and default request settings
   * @param auth - Optional authentication handler
   */
  constructor(config: CcClientConfig, auth?: CcAuth | null) {
    this.#baseUrl = config.baseUrl;
    this.#defaultRequestsConfig = mergeRequestConfig(DEFAULT_REQUEST_CONFIG, config.defaultRequestConfig);
    this.#defaultStreamsConfig = mergeStreamConfig(DEFAULT_STREAM_CONFIG, config.defaultStreamConfig);
    this.#hooks = config.hooks ?? {};
    this.#auth = auth;
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
      if (command instanceof CompositeCommand) {
        return await this._compose(command, requestConfig);
      }

      const requestParams = await this._getCommandRequestParams(command, requestConfig);
      const request = await this._prepareRequest(requestParams, requestConfig);
      const response = await sendRequest<CommandOutput>(request);
      return await this._handleResponse(response, request, command);
    } catch (e) {
      if (this.#hooks.onError != null) {
        void this.#hooks.onError(e);
      }

      throw e;
    }
  }

  /**
   * Constructs a complete URL for an API endpoint
   *
   * @param getUrl - URL generator with parameters
   * @returns The complete URL with base URL and authentication parameters
   */
  getUrl(getUrl: GetUrl<Api, unknown>): URL {
    const url = getUrl.get(getUrl.params);

    const left = this.#baseUrl.endsWith('/') ? this.#baseUrl : this.#baseUrl + '/';
    const right = url.startsWith('/') ? url.slice(1) : url;
    const result = new URL(left + right, globalThis.location?.href);

    this.#auth?.applyOnUrl(result);

    return result;
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
    const transformedParams = (await this._transformStreamParams(command, requestAndStreamConfig)) as CommandInput;

    const streamConfigWithDefaults = mergeStreamConfig(this.#defaultStreamsConfig, requestAndStreamConfig);
    return command.createStream(async () => {
      const preparedRequestParams = await command.toRequestParams(transformedParams);
      return this._prepareRequest(preparedRequestParams, requestAndStreamConfig);
    }, streamConfigWithDefaults);
  }

  /**
   * Transforms command parameters before sending the request
   *
   * @param command - The command whose parameters need transformation
   * @param _requestConfig - Optional request configuration
   * @returns The transformed parameters
   */
  protected _transformCommandParams(
    command: Command<Api, unknown, unknown>,
    _requestConfig?: CcRequestConfigPartial,
  ): Promise<unknown> {
    return Promise.resolve(command.params);
  }

  /**
   * Transforms stream command parameters before creating the stream
   *
   * @param command - The stream command whose parameters need transformation
   * @param _requestConfig - Optional request configuration
   * @returns The transformed parameters
   */
  protected _transformStreamParams(
    command: StreamCommand<Api, unknown, CcStream>,
    _requestConfig?: CcRequestConfigPartial,
  ): Promise<unknown> {
    return Promise.resolve(command.params);
  }

  /**
   * Handles execution of composite commands that consist of multiple sub-commands
   *
   * @param command - The composite command to execute
   * @param requestConfig - Optional request configuration
   * @returns The result of executing all sub-commands
   */
  protected async _compose<CommandOutput>(
    command: CompositeCommand<Api, unknown, CommandOutput>,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<CommandOutput> {
    const transformedParams = await this._transformCommandParams(command, requestConfig);

    return command.compose(transformedParams, {
      send: (command, commandRequestConfig) =>
        this.send(command, mergeRequestConfigPartial(requestConfig, commandRequestConfig)),
    });
  }

  /**
   * Prepares request parameters for a simple command
   *
   * @param command - The command to prepare parameters for
   * @param requestConfig - Optional request configuration
   * @returns The prepared request parameters
   */
  protected async _getCommandRequestParams(
    command: SimpleCommand<Api, unknown, unknown>,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<Partial<CcRequestParams>> {
    const transformedParams = await this._transformCommandParams(command, requestConfig);
    return command.toRequestParams(transformedParams);
  }

  /**
   * Prepares the final request by combining parameters, configuration, and authentication
   *
   * @param requestParams - The request parameters
   * @param requestConfig - Optional request configuration
   * @returns The prepared request
   */
  protected async _prepareRequest(
    requestParams: Partial<CcRequestParams>,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<CcRequest> {
    const preparedRequestParams: WithRequired<Partial<CcRequestParams>, 'queryParams' | 'headers'> = {
      ...requestParams,
      headers: requestParams.headers ?? new Headers(),
      queryParams: requestParams.queryParams ?? new QueryParams(),
    };

    // apply hook
    if (this.#hooks.onRequest != null) {
      await this.#hooks.onRequest(preparedRequestParams);
    }

    // apply auth if auth method is defined
    this.#auth?.applyOnRequestParams(preparedRequestParams);

    return {
      // params
      ...DEFAULT_REQUEST_PARAMS,
      ...preparedRequestParams,
      // config
      ...mergeRequestConfig(this.#defaultRequestsConfig, requestConfig),
      // url
      url: this.#baseUrl + preparedRequestParams.url,
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
  protected async _handleResponse<CommandOutput>(
    response: CcResponse<CommandOutput>,
    request: CcRequest,
    command: SimpleCommand<Api, unknown, CommandOutput>,
  ): Promise<CommandOutput> {
    // apply hook
    if (this.#hooks.onResponse != null) {
      await this.#hooks.onResponse(response, request);
    }

    // special case for null response
    const emptyResponsePolicy = command.getEmptyResponsePolicy(response.status, response.body);
    if (emptyResponsePolicy?.isEmpty) {
      return (emptyResponsePolicy.emptyValue ?? null) as CommandOutput;
    }

    // handle http errors
    handleHttpErrors(request, response, command);

    return command.transformCommandOutput(response.body);
  }
}

function mergeStreamConfig(baseConfig: CcStreamConfig, config: CcStreamConfigPartial | null): CcStreamConfig {
  const overrideConfig: CcStreamConfigPartial = config ?? {};

  return {
    ...baseConfig,
    ...overrideConfig,
    retry: { ...baseConfig.retry, ...(overrideConfig?.retry ?? {}) },
  };
}
