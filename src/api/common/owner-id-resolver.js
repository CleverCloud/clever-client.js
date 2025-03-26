/**
 * @typedef {import('./owner-id-resolver.types.js').Summary} Summary
 * @typedef {import('./owner-id-resolver.types.js').OwnerIdIndex} OwnerIdIndex
 * @typedef {import('./owner-id-resolver.types.js').OwnerIdIndexStore} OwnerIdIndexStore
 * @typedef {import('../cc-api-client.js').CcApiClient} CcApiClient
 * @typedef {import('../types/cc-api.types.js').ApplicationOrAddonId} ApplicationOrAddonId
 * @typedef {import('../../common/types/request.types.js').CcRequestConfig} CcRequestConfig
 */

import { CcClientError } from '../../common/lib/error/cc-client-errors.js';
import { get } from '../../common/lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from './cc-api-commands.js';

/**
 *
 */
export class OwnerIdResolver {
  /** @type {CcApiClient} */
  #client;
  /** @type {OwnerIdIndexStore} */
  #indexStore;
  /** @type {OwnerIdIndex} */
  #index;

  /**
   * @param {CcApiClient} client
   * @param {OwnerIdIndexStore} indexStore
   */
  constructor(client, indexStore) {
    this.#client = client;
    this.#indexStore = indexStore;
  }

  /**
   * @param {ApplicationOrAddonId} applicationOrAddonId
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<string>}
   */
  async resolve(applicationOrAddonId, requestConfig) {
    if (applicationOrAddonId.ownerId != null) {
      return applicationOrAddonId.ownerId;
    }

    await this.#init();

    if ('applicationId' in applicationOrAddonId) {
      return this.#resolve(() => this.#index.applicationIds, applicationOrAddonId.applicationId, requestConfig);
    }

    const addonId = applicationOrAddonId.addonId;
    if (addonId?.startsWith('addon_')) {
      return this.#resolve(() => this.#index.addonIds, addonId, requestConfig);
    }
    return this.#resolve(() => this.#index.addonRealIds, addonId, requestConfig);
  }

  /**
   * @param {() => Record<string, string>} index
   * @param {string} id
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<string>}
   */
  async #resolve(index, id, requestConfig) {
    let ownerId = index()[id];
    if (ownerId == null) {
      await this.#fetchAndStore(requestConfig);
      ownerId = index()[id];
    }
    if (ownerId == null) {
      throw new CcClientError(`Cannot resolve ownerId from id ${id}`, 'CANNOT_RESOLVE_OWNER_ID');
    }
    return ownerId;
  }

  async #init() {
    if (this.#index == null) {
      this.#index = (await this.#indexStore.read()) ?? {
        applicationIds: {},
        addonIds: {},
        addonRealIds: {},
      };
    }
  }

  /**
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<void>}
   */
  async #fetchAndStore(requestConfig) {
    const summary = await this.#client.send(new SummaryCommand(), { ...requestConfig, cache: 'reload' });
    this.#indexSummary(summary);
    return this.#indexStore.write(this.#index);
  }

  /**
   * @param {Summary} summary
   */
  #indexSummary(summary) {
    /** @type {OwnerIdIndex} */
    this.#index = {
      applicationIds: {},
      addonIds: {},
      addonRealIds: {},
    };

    const organisations = [...summary.organisations, summary.user];

    for (const organisation of organisations) {
      organisation.applications.forEach((application) => {
        this.#index.applicationIds[application.id] = organisation.id;
      });
      organisation.addons.forEach((addon) => {
        this.#index.addonIds[addon.id] = organisation.id;
        this.#index.addonRealIds[addon.realId] = organisation.id;
      });
    }
  }
}

/**
 * @extends {CcApiSimpleCommand<Summary>}
 */
class SummaryCommand extends CcApiSimpleCommand {
  toRequestParams() {
    return get('/v2/summary');
  }

  /**
   *
   * @param {Summary} response
   * @returns {Summary}
   */
  transformResponseBody(response) {
    const userId = response.user.id;
    response.organisations = response.organisations?.filter((organisations) => organisations.id !== userId) ?? [];
    return response;
  }
}
