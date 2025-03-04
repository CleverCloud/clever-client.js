import { handleHttpErrors } from './errors/handle-http-errors.js';
import { AbstractCommand } from './commands/abstract-command.js';

/**
 * @typedef {import('./plugins/plugins.type.js').Plugin} Plugin
 * @typedef {import('./request/request.types.js').RequestParams} RequestParams
 * @typedef {import('./request/request.types.js').RequestAdapter} RequestAdapter
 */

export class CleverClient {
  /** @type {RequestAdapter} */
  #requestAdapter;
  /** @type {Array<Plugin>} */
  #plugins = [];

  /**
   * @param {RequestAdapter} requestAdapter The function that will do the real HTTP fetch
   */
  constructor (requestAdapter) {
    this.#requestAdapter = requestAdapter;
  }

  /**
   * @param {Plugin} plugin
   * @returns {this}
   */
  register (plugin) {
    this.#plugins.push(plugin);
    return this;
  }

  /**
   * @param {import('./commands/abstract-command.js').AbstractCommand<ResponseBody>|Partial<RequestParams>} commandOrRequest
   * @param {{timeout?: number, cacheDelay?: number, signal?: AbortSignal}} [options]
   * @returns {Promise<import('./request/request.types.js').Response<ResponseBody>>}
   * @template ResponseBody
   */
  async run (commandOrRequest, options) {
    return this.#prepareRequest(commandOrRequest, options)
      .then((requestParams) => this.#doRequest(requestParams))
      .then((response) => this.#handleResponse(response))
      // todo: should we return a Response or the response body directly ?
      .catch(async (e) => {
        throw await this.#onError(e);
      });
  }

  /**
   * @param {import('./commands/abstract-command.js').AbstractCommand<?>|Partial<RequestParams>} commandOrRequest
   * @param {{timeout?: number, cacheDelay?: number, signal?: AbortSignal}} [options]
   * @returns {Promise<Partial<RequestParams>>}
   */
  async #prepareRequest (commandOrRequest, options) {
    /** @type {Partial<RequestParams>} */
    let requestParams = commandOrRequest instanceof AbstractCommand
      ? commandOrRequest.toRequestParams() ?? {}
      : commandOrRequest;

    const plugins = this.#plugins.filter((p) => p.type === 'prepareRequest');
    for (const plugin of plugins) {
      requestParams = await plugin.handle(requestParams);
    }

    return { ...{ method: 'GET', cors: false }, ...requestParams, ...(options ?? {}) };
  }

  /**
   * @param {Partial<RequestParams>} requestParams
   * @returns {Promise<import('./request/request.types.js').Response<ResponseBody>>}
   * @template ResponseBody
   */
  async #doRequest (requestParams) {
    const plugins = this.#plugins.filter((p) => p.type === 'requestWrapper');

    if (plugins.length === 0) {
      return this.#requestAdapter(requestParams);
    }

    let i = 0;
    /** @type {RequestAdapter} */
    const handler = (requestParams) => {
      i++;
      if (i >= plugins.length) {
        return this.#requestAdapter(requestParams);
      }
      else {
        return plugins[i].handle(requestParams, handler);
      }
    };

    return plugins[0].handle(requestParams, handler);
  }

  /**
   * @param {import('./request/request.types.js').Response<ResponseBody>} response
   * @returns {Promise<import('./request/request.types.js').Response<ResponseBody>>}
   * @template ResponseBody
   * @throws CleverClientError
   * @throws CleverHttpError
   */
  async #handleResponse (response) {
    // apply plugins
    const plugins = this.#plugins.filter((p) => p.type === 'onResponse');
    for (const plugin of plugins) {
      await plugin.handle(response);
    }

    // handle http errors
    handleHttpErrors(response);

    return response;
  }

  /**
   * @param {any} e
   * @returns {Promise<any>}
   */
  async #onError (e) {
    // todo: plugin should be able to convert error to something normal/ok with another response?

    const onErrorPlugins = this.#plugins.filter((p) => p.type === 'onError');

    let err = e;

    for (const plugin of onErrorPlugins) {
      try {
        await plugin.handle(err);
      }
      catch (e) {
        err = e;
      }
    }

    return err;
  }
}
