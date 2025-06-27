/**
 * @import { CcAuth } from './auth/cc-auth.js'
 * @import { Command } from '../types/command.types.js'
 * @import { SimpleCommand } from './command/command.js'
 * @import { GetUrl } from './get-url.js'
 * @import { CcClientConfig, CcClientHooks } from '../types/client.types.js'
 * @import { CcRequest, CcRequestParams, CcRequestConfig, CcResponse, HttpMethod } from '../types/request.types.js'
 */
import { CompositeCommand } from './command/command.js';
import { handleHttpErrors } from './error/handle-http-errors.js';
import { sendRequest } from './request/request.js';

/** @type {CcRequestConfig} */
const DEFAULT_REQUEST_CONFIG = {
  cors: false,
  timeout: 0,
  cache: false,
  cacheDelay: 0,
  debug: false,
};
/** @type {Partial<CcRequestParams> & { method: HttpMethod }} */
const DEFAULT_REQUEST_PARAMS = {
  method: 'GET',
};

/**
 * @template {string} Api
 */
export class CcClient {
  /** @type {string} */
  #baseUrl;
  /** @type {CcRequestConfig} */
  #defaultRequestsConfig;
  /** @type {CcClientHooks} */
  #hooks;
  /** @type {CcAuth|null} */
  #auth;

  /**
   * @param {CcClientConfig} config
   * @param {CcAuth|null} [auth]
   */
  constructor(config, auth) {
    this.#baseUrl = config.baseUrl;
    this.#defaultRequestsConfig = {
      ...DEFAULT_REQUEST_CONFIG,
      ...(config.defaultRequestConfig ?? {}),
    };
    this.#hooks = config.hooks ?? {};
    this.#auth = auth;
  }

  /**
   * @param {Command<Api, CommandInput, CommandOutput>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<CommandOutput>}
   * @template CommandInput
   * @template CommandOutput
   */
  async send(command, requestConfig) {
    try {
      if (command instanceof CompositeCommand) {
        return await this._compose(command, requestConfig);
      }

      return await this._getCommandRequestParams(command, requestConfig)
        .then((requestParams) => this._prepareRequest(command, requestParams, requestConfig))
        .then((request) => sendRequest(request))
        .then((response) => this._handleResponse(response, command));
    } catch (e) {
      if (this.#hooks.onError != null) {
        this.#hooks.onError(e);
      }

      throw e;
    }
  }

  /**
   * @param {GetUrl<Api, ?>} getUrl
   * @returns {URL}
   */
  getUrl(getUrl) {
    const url = new URL(getUrl.get(getUrl.params), this.#baseUrl);

    if (getUrl.isAuthRequired()) {
      this.#auth?.applyOnUrl(url);
    }

    return url;
  }

  /**
   * @param {Command<Api, ?, ?>} command
   * @param {Partial<CcRequestConfig>} [_requestConfig]
   * @returns {Promise<any>}
   * @protected
   */
  async _transformCommandParams(command, _requestConfig) {
    return command.params;
  }

  /**
   * @param {CompositeCommand<Api, ?, CommandOutput>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<CommandOutput>}
   * @template CommandOutput
   * @protected
   */
  async _compose(command, requestConfig) {
    const transformedParams = await this._transformCommandParams(command, requestConfig);

    return command.compose(transformedParams, {
      send: (command, commandRequestConfig) =>
        this.send(command, { ...(requestConfig ?? {}), ...(commandRequestConfig ?? {}) }),
    });
  }

  /**
   * @param {SimpleCommand<Api, ?, ?>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<Partial<CcRequestParams>>}
   * @protected
   */
  async _getCommandRequestParams(command, requestConfig) {
    const transformedParams = await this._transformCommandParams(command, requestConfig);
    return command.toRequestParams(transformedParams);
  }

  /**
   * @param {SimpleCommand<Api, ?, ?>} command
   * @param {Partial<CcRequestParams>} requestParams
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<CcRequest>}
   * @protected
   */
  async _prepareRequest(command, requestParams, requestConfig) {
    /** @type {Partial<CcRequestParams>} */
    let preparedRequestParams = requestParams;

    // apply hook
    if (this.#hooks.prepareRequestParams != null) {
      preparedRequestParams = await this.#hooks.prepareRequestParams(preparedRequestParams);
    }

    // apply auth (if required by command and if auth method is defined on client)
    if (command.isAuthRequired()) {
      this.#auth?.applyOnRequestParams(preparedRequestParams);
    }

    return {
      // params
      ...DEFAULT_REQUEST_PARAMS,
      ...preparedRequestParams,
      // config
      ...this.#defaultRequestsConfig,
      ...(requestConfig ?? {}),
      // url
      url: this.#baseUrl + preparedRequestParams.url,
    };
  }

  /**
   * @param {CcResponse<CommandOutput>} response
   * @param {SimpleCommand<Api, ?, ?>} command
   * @returns {Promise<CommandOutput>}
   * @template CommandOutput
   * @throws CcClientError
   * @throws CcHttpError
   * @protected
   */
  async _handleResponse(response, command) {
    // apply hook
    if (this.#hooks.onResponse != null) {
      await this.#hooks.onResponse(response);
    }

    // special case for null response
    if (command.isEmptyResponse(response.status, response.body)) {
      return command.getEmptyResponse();
    }

    // handle http errors
    handleHttpErrors(response);

    return command.transformCommandOutput(response.body);
  }
}
