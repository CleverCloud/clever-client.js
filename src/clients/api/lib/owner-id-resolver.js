/**
 * @import { OwnerIdIndex, Store } from '../types/owner-id-resolver.types.js'
 * @import { CcApiClient } from '../cc-api-client.js'
 * @import { GetOrganisationSummariesCommandOutput } from '../commands/organisation/get-organisation-summaries-command.types.js'
 * @import { ApplicationOrAddonId } from '../types/cc-api.types.js'
 * @import { CcRequestConfig } from '../../../types/request.types.js'
 */
import { CcClientError } from '../../../lib/error/cc-client-errors.js';
import { GetOrganisationSummariesCommand } from '../commands/organisation/get-organisation-summaries-command.js';

/**
 *
 */
export class OwnerIdResolver {
  /** @type {CcApiClient} */
  #client;
  /** @type {Store<OwnerIdIndex>} */
  #indexStore;
  /** @type {OwnerIdIndex} */
  #index;

  /**
   * @param {CcApiClient} client
   * @param {Store<OwnerIdIndex>} indexStore
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
    const summary = await this.#client.send(new GetOrganisationSummariesCommand(), {
      ...requestConfig,
      cache: 'reload',
    });
    this.#indexSummary(summary);
    return this.#indexStore.write(this.#index);
  }

  /**
   * @param {GetOrganisationSummariesCommandOutput} summaries
   */
  #indexSummary(summaries) {
    /** @type {OwnerIdIndex} */
    this.#index = {
      applicationIds: {},
      addonIds: {},
      addonRealIds: {},
    };

    for (const organisation of summaries) {
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
