import { handleHttpErrors } from './errors/handle-http-errors.js';
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
   * @param {import('./command/abstract-command.js').AbstractCommand<ResponseBody>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
   */
  async send(command, requestConfig) {
    return this.#prepareRequest(command, requestConfig)
      .then((request) => sendRequest(request))
      .then((response) => this.#handleResponse(response, command))
      .catch(async (e) => {
        throw await this.#onError(e);
      });
  }

  /**
   * @returns {CcAuth}
   */
  getAuth() {
    return false;
  }

  /**
   * @param {import('./command/abstract-command.js').AbstractCommand<?>} command
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<CcRequest>}
   */
  async #prepareRequest(command, requestConfig) {
    /** @type {Partial<CcRequestParams>} */
    let requestParams = command.toRequestParams();

    // apply hook
    if (this.#hooks.prepareRequestParams != null) {
      requestParams = await this.#hooks.prepareRequestParams(requestParams);
    }

    // apply auth (if required by command and if auth method is defined on client)
    if (command.isAuthRequired()) {
      const auth = this.getAuth();
      if (auth) {
        requestParams = await auth(requestParams);
      }
    }

    return {
      // params
      ...DEFAULT_REQUEST_PARAMS,
      ...requestParams,
      // config
      ...this.#defaultRequestsConfig,
      ...(requestConfig ?? {}),
      // url
      url: this.#baseUrl + requestParams.url,
    };
  }

  /**
   * @param {import('../types/request.types.js').CcResponse<ResponseBody>} response
   * @param {import('./command/abstract-command.js').AbstractCommand<ResponseBody>} command
   * @returns {Promise<ResponseBody>}
   * @template ResponseBody
   * @throws CcClientError
   * @throws CcHttpError
   */
  async #handleResponse(response, command) {
    // apply hook
    if (this.#hooks.onResponse != null) {
      await this.#hooks.onResponse(response);
    }

    // special case for 404
    if (command.is404Success() && response.status === 404) {
      return null;
    }

    // handle http errors
    handleHttpErrors(response);

    return command.convertResponseBody(response.body);
  }

  /**
   * @param {any} e
   * @returns {Promise<any>}
   */
  async #onError(e) {
    // todo: hook should be able to convert error to something normal/ok with another response?

    let err = e;

    // apply hook
    if (this.#hooks.onError != null) {
      try {
        await this.#hooks.onError(err);
      } catch (e) {
        err = e;
      }
    }

    return err;
  }
}
