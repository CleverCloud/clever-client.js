import { CompositeCommand } from './command/command.js';
import { handleHttpErrors } from './error/handle-http-errors.js';
import { sendRequest } from './request/request.js';

/**
 * @typedef {import('../types/auth.types.js').CcAuth} CcAuth
 * @typedef {import('../types/client.types.js').CcClientConfig} CcClientConfig
 * @typedef {import('../types/client.types.js').CcClientHooks} CcClientHooks
 * @typedef {import('../types/request.types.js').CcRequest} CcRequest
 * @typedef {import('../types/request.types.js').CcRequestParams} CcRequestParams
 * @typedef {import('../types/request.types.js').CcRequestConfig} CcRequestConfig
 * @typedef {import('../types/request.types.js').HttpMethod} HttpMethod
 */

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

  /**
   * @param {CcClientConfig} config
   */
  constructor(config) {
    this.#baseUrl = config.baseUrl;
    this.#defaultRequestsConfig = {
      ...DEFAULT_REQUEST_CONFIG,
      ...(config.defaultRequestConfig ?? {}),
    };
    this.#hooks = config.hooks ?? {};
  }

  /**
   * @param {import('../types/command.types.js').Command<Api, CommandInput, CommandOutput>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<CommandOutput>}
   * @template CommandInput
   * @template CommandOutput
   */
  async send(command, requestConfig) {
    if (command instanceof CompositeCommand) {
      return this._compose(command, requestConfig);
    }

    return this._getCommandRequestParams(command, requestConfig)
      .then((requestParams) => this._prepareRequest(command, requestParams, requestConfig))
      .then((request) => sendRequest(request))
      .then((response) => this._handleResponse(response, command))
      .catch(async (e) => {
        await this._onError(e);
      });
  }

  /**
   * @returns {CcAuth}
   * @protected
   */
  _getAuth() {
    return false;
  }

  /**
   * @param {import('../types/command.types.js').Command<Api, ?, ?>} command
   * @param {Partial<CcRequestConfig>} [_requestConfig]
   * @returns {Promise<any>}
   * @protected
   */
  async _transformCommandParams(command, _requestConfig) {
    return command.params;
  }

  /**
   * @param {import('./command/command.js').CompositeCommand<Api, ?, CommandOutput>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<CommandOutput>}
   * @template CommandOutput
   * @protected
   */
  async _compose(command, requestConfig) {
    const transformedParams = await this._transformCommandParams(command, requestConfig);

    return command.compose(transformedParams, {
      send: (command, rc) => this.send(command, { ...(requestConfig ?? {}), ...(rc ?? {}) }),
    });
  }

  /**
   * @param {import('./command/command.js').SimpleCommand<Api, ?, ?>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<Partial<CcRequestParams>>}
   * @protected
   */
  async _getCommandRequestParams(command, requestConfig) {
    const transformedParams = await this._transformCommandParams(command, requestConfig);
    return command.toRequestParams(transformedParams);
  }

  /**
   * @param {import('./command/command.js').SimpleCommand<Api, ?, ?>} command
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
      const auth = this._getAuth();
      if (auth) {
        preparedRequestParams = await auth(preparedRequestParams);
      }
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
   * @param {import('../types/request.types.js').CcResponse<CommandOutput>} response
   * @param {import('./command/command.js').SimpleCommand<Api, ?, ?>} command
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
      return null;
    }

    // handle http errors
    handleHttpErrors(response);

    return command.transformCommandOutput(response.body);
  }

  /**
   * @param {any} e
   * @returns {Promise<any>}
   * @protected
   */
  async _onError(e) {
    // apply hook
    if (this.#hooks.onError != null) {
      this.#hooks.onError(e);
    }

    throw e;
  }
}
