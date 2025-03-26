import { CompositeCommand } from './command/simpleCommand.js';
import { handleHttpErrors } from './error/handle-http-errors.js';
import { sendRequest } from './request/request.js';

/**
 * @typedef {import('../types/auth.types.js').CcAuth} CcAuth
 * @typedef {import('../types/clever-client.types.js').CcClientConfig} CcClientConfig
 * @typedef {import('../types/clever-client.types.js').CcClientHooks} CcClientHooks
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
 *
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
   * @param {import('../types/command.types.js').Command<ResponseBody>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
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
   */
  getAuth() {
    return false;
  }

  /**
   * @param {import('./command/simpleCommand.js').CompositeCommand<ResponseBody, CcClient>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
   * @protected
   */
  async _compose(command, requestConfig) {
    return command.compose({
      send: (command, rc) => this.send(command, { ...(requestConfig ?? {}), ...(rc ?? {}) }),
    });
  }

  /**
   * @param {import('./command/./simpleCommand.js').SimpleCommand<?>} command
   * @param {Partial<CcRequestConfig>} [_requestConfig]
   * @returns {Promise<Partial<CcRequestParams>>}
   * @protected
   */
  async _getCommandRequestParams(command, _requestConfig) {
    return command.toRequestParams();
  }

  /**
   * @param {import('./command/./simpleCommand.js').SimpleCommand<?>} command
   * @param {Partial<CcRequestParams>} requestParams
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<CcRequest>}
   * @protected
   */
  async _prepareRequest(command, requestParams, requestConfig) {
    /** @type {Partial<CcRequestParams>} */
    let rp = requestParams;

    // apply hook
    if (this.#hooks.prepareRequestParams != null) {
      rp = await this.#hooks.prepareRequestParams(rp);
    }

    // apply auth (if required by command and if auth method is defined on client)
    if (command.isAuthRequired()) {
      const auth = this.getAuth();
      if (auth) {
        rp = await auth(rp);
      }
    }

    return {
      // params
      ...DEFAULT_REQUEST_PARAMS,
      ...rp,
      // config
      ...this.#defaultRequestsConfig,
      ...(requestConfig ?? {}),
      // url
      url: this.#baseUrl + rp.url,
    };
  }

  /**
   * @param {import('../types/request.types.js').CcResponse<ResponseBody>} response
   * @param {import('./command/./simpleCommand.js').SimpleCommand<?>} command
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
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

    return command.transformResponseBody(response.body);
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
