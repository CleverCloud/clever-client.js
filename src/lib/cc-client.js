/**
 * @import { CcAuth } from './auth/cc-auth.js'
 * @import { Command } from '../types/command.types.js'
 * @import { SimpleCommand } from './command/command.js'
 * @import { GetUrl } from './get-url.js'
 * @import { CcClientConfig, CcClientHooks } from '../types/client.types.js'
 * @import { CcRequest, CcRequestParams, CcRequestConfig, CcRequestConfigPartial, CcResponse, HttpMethod } from '../types/request.types.js'
 */
import { CompositeCommand } from './command/command.js';
import { handleHttpErrors } from './error/handle-http-errors.js';
import { QueryParams } from './request/query-params.js';
import { sendRequest } from './request/request.js';
import { mergeRequestConfig, mergeRequestConfigPartial } from './utils.js';

/** @type {CcRequestConfig} */
const DEFAULT_REQUEST_CONFIG = {
  cors: false,
  timeout: 0,
  cache: null,
  debug: false,
};
/** @type {Partial<CcRequestParams> & { method: HttpMethod }} */
const DEFAULT_REQUEST_PARAMS = {
  method: 'GET',
};

/**
 * CcClient is the main client class for interacting with the Clever Cloud API.
 * It handles HTTP requests, authentication, and response processing.
 *
 * @template {string} Api - The API type this client targets (e.g., 'cc-api', 'cc-api-bridge')
 *
 * @description
 * The CcClient class provides methods to:
 * - Send commands to the API (both simple and composite)
 * - Handle request/response lifecycle
 * - Manage authentication
 * - Transform request parameters and responses
 * - Handle errors and empty responses
 *
 * @example
 * ```javascript
 * // Create client configuration
 * const config = {
 *   baseUrl: 'https://api.clever-cloud.com',
 *   defaultRequestConfig: { timeout: 5000 }
 * };
 *
 * // Initialize authentication and client
 * const auth = new CcAuth();
 * const client = new CcClient(config, auth);
 *
 * // Send a command
 * const command = new SimpleCommand();
 * const result = await client.send(command);
 * ```
 */
export class CcClient {
  /**
   * The base URL for the Clever Cloud API
   * @type {string}
   */
  #baseUrl;
  /**
   * Default configuration for all requests made by this client
   * @type {CcRequestConfig}
   */
  #defaultRequestsConfig;
  /**
   * Client hooks for request/response lifecycle
   * @type {CcClientHooks}
   */
  #hooks;
  /**
   * Authentication handler for requests
   * @type {CcAuth|null}
   */
  #auth;

  /**
   * Creates a new CcClient instance
   *
   * @param {CcClientConfig} config - Client configuration including baseUrl and default request settings
   * @param {CcAuth|null} [auth] - Optional authentication handler
   */
  constructor(config, auth) {
    this.#baseUrl = config.baseUrl;
    this.#defaultRequestsConfig = mergeRequestConfig(DEFAULT_REQUEST_CONFIG, config.defaultRequestConfig);
    this.#hooks = config.hooks ?? {};
    this.#auth = auth;
  }

  /**
   * Sends a command to the API and processes the response
   *
   * @param {Command<Api, CommandInput, CommandOutput>} command - The command to execute
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration that overrides the default
   * @returns {Promise<CommandOutput>} The processed command response
   * @template CommandInput - The type of the command input parameters
   * @template CommandOutput - The type of the command output
   * @throws {CcClientError} When there's a client-side error
   * @throws {CcHttpError} When there's a server-side error
   */
  async send(command, requestConfig) {
    try {
      if (command instanceof CompositeCommand) {
        return await this._compose(command, requestConfig);
      }

      const requestParams = await this._getCommandRequestParams(command, requestConfig);
      const request = await this._prepareRequest(requestParams, requestConfig);
      const response = await sendRequest(request);
      return await this._handleResponse(response, request, command);
    } catch (e) {
      if (this.#hooks.onError != null) {
        this.#hooks.onError(e);
      }

      throw e;
    }
  }

  /**
   * Constructs a complete URL for an API endpoint
   *
   * @param {GetUrl<Api, ?>} getUrl - URL generator with parameters
   * @returns {URL} The complete URL with base URL and authentication parameters
   */
  getUrl(getUrl) {
    const url = getUrl.get(getUrl.params);

    const left = this.#baseUrl.endsWith('/') ? this.#baseUrl : this.#baseUrl + '/';
    const right = url.startsWith('/') ? url.slice(1) : url;
    const result = new URL(left + right, globalThis.location?.href);

    this.#auth?.applyOnUrl(result);

    return result;
  }

  /**
   * Transforms command parameters before sending the request
   *
   * @param {Command<Api, ?, ?>} command - The command whose parameters need transformation
   * @param {CcRequestConfigPartial} [_requestConfig] - Optional request configuration
   * @returns {Promise<any>} The transformed parameters
   * @protected
   */
  async _transformCommandParams(command, _requestConfig) {
    return command.params;
  }

  /**
   * Handles execution of composite commands that consist of multiple sub-commands
   *
   * @param {CompositeCommand<Api, ?, CommandOutput>} command - The composite command to execute
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<CommandOutput>} The result of executing all sub-commands
   * @template CommandOutput - The type of the composite command output
   * @protected
   */
  async _compose(command, requestConfig) {
    const transformedParams = await this._transformCommandParams(command, requestConfig);

    return command.compose(transformedParams, {
      send: (command, commandRequestConfig) =>
        this.send(command, mergeRequestConfigPartial(requestConfig, commandRequestConfig)),
    });
  }

  /**
   * Prepares request parameters for a simple command
   *
   * @param {SimpleCommand<Api, ?, ?>} command - The command to prepare parameters for
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<Partial<CcRequestParams>>} The prepared request parameters
   * @protected
   */
  async _getCommandRequestParams(command, requestConfig) {
    const transformedParams = await this._transformCommandParams(command, requestConfig);
    return command.toRequestParams(transformedParams);
  }

  /**
   * Prepares the final request by combining parameters, configuration, and authentication
   *
   * @param {Partial<CcRequestParams>} requestParams - The request parameters
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<CcRequest>} The prepared request
   * @protected
   */
  async _prepareRequest(requestParams, requestConfig) {
    /** @type {Partial<CcRequestParams>} */
    let preparedRequestParams = {
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
   * @param {CcResponse<CommandOutput>} response - The response
   * @param {CcRequest} request - The request
   * @param {SimpleCommand<Api, ?, ?>} command - The command that generated the response
   * @returns {Promise<CommandOutput>} The processed response
   * @template CommandOutput - The type of the expected output
   * @throws {CcClientError} When there's a client-side error processing the response
   * @throws {CcHttpError} When the server returns an error response
   * @protected
   */
  async _handleResponse(response, request, command) {
    // apply hook
    if (this.#hooks.onResponse != null) {
      await this.#hooks.onResponse(response, request);
    }

    // special case for null response
    const emptyResponsePolicy = command.getEmptyResponsePolicy(response.status, response.body);
    if (emptyResponsePolicy?.isEmpty) {
      return emptyResponsePolicy.emptyValue ?? null;
    }

    // handle http errors
    handleHttpErrors(request, response, command);

    return command.transformCommandOutput(response.body);
  }
}
