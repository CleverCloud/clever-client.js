/**
 * @typedef {import('./owner-id-resolver.types.js').Summary} Summary
 * @typedef {import('./owner-id-resolver.types.js').OwnerIdIndex} OwnerIdIndex
 * @typedef {import('../cc-api-client.js').CcApiClient} CcApiClient
 * @typedef {import('../types/cc-api.types.js').ApplicationOrAddonId} ApplicationOrAddonId
 */

import { get } from '../../common/lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from './cc-api-commands.js';

/**
 *
 */
export class OwnerIdResolver {
  /** @type {CcApiClient} */
  #client;
  /** @type {IndexStore} */
  #indexStore;
  /** @type {OwnerIdIndex} */
  #index;

  /**
   * @param {CcApiClient} client
   * @param {IndexStore} indexStore
   */
  constructor(client, indexStore) {
    this.#client = client;
    this.#indexStore = indexStore;
  }

  /**
   * @param {ApplicationOrAddonId} applicationOrAddonId
   * @returns {Promise<string>}
   */
  async resolve(applicationOrAddonId) {
    if (applicationOrAddonId.ownerId != null) {
      return applicationOrAddonId.ownerId;
    }

    await this.#init();

    if ('applicationId' in applicationOrAddonId) {
      return this.resolveFromApplicationId(applicationOrAddonId.applicationId);
    }
    if ('addonId' in applicationOrAddonId) {
      const addonId = applicationOrAddonId.addonId;
      if (addonId.startsWith('addon_')) {
        return this.resolveFromAddonId(addonId);
      }
      return this.resolveFromAddonRealId(addonId);
    }
    throw new Error('Cannot resolve owner id from unspecified applicationId or addonId');
  }

  /**
   * @param {string} applicationId
   * @returns {Promise<string>}
   */
  async resolveFromApplicationId(applicationId) {
    return this.#resolve(() => this.#index.applicationIds, applicationId);
  }

  /**
   * @param {string} addonId
   * @returns {Promise<string>}
   */
  async resolveFromAddonId(addonId) {
    return this.#resolve(() => this.#index.addonIds, addonId);
  }

  /**
   * @param {string} addonRealId
   * @returns {Promise<string>}
   */
  async resolveFromAddonRealId(addonRealId) {
    return this.#resolve(() => this.#index.addonRealIds, addonRealId);
  }

  /**
   * @param {() => Record<string, string>} index
   * @param {string} id
   * @returns {Promise<string>}
   */
  async #resolve(index, id) {
    let ownerId = index()[id];
    if (ownerId == null) {
      await this.#fetchAndStore();
      ownerId = index()[id];
    }
    if (ownerId == null) {
      throw new Error(`Cannot resolve ownerId from id ${id}`);
    }
    // todo: throw Error or return null?
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

  async #fetchAndStore() {
    const summary = await this.#client.send(new SummaryCommand(), { cacheDelay: 0 });
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
 * @abstract
 */
class IndexStore {
  /**
   * @param {OwnerIdIndex} _index
   * @abstract
   */
  async write(_index) {
    throw new Error('Not implemented');
  }

  /**
   * @returns {Promise<OwnerIdIndex>}
   */
  async read() {
    throw new Error('Not implemented');
  }
}

export class MemoryIndexStore extends IndexStore {
  /** @type {OwnerIdIndex} */
  #index;

  /**
   * @param {OwnerIdIndex} index
   */
  async write(index) {
    this.#index = index;
  }

  /**
   * @returns {Promise<OwnerIdIndex>}
   */
  async read() {
    return this.#index;
  }
}

export class FileIndexStore {
  /** @type {OwnerIdIndex} */
  #index;

  /**
   * @param {OwnerIdIndex} index
   */
  write(index) {
    this.#index = index;
  }

  /**
   * @returns {OwnerIdIndex}
   */
  read() {
    return this.#index;
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
