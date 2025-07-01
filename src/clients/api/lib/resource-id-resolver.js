/**
 * @import { ResourceIdIndex, Store, AddonIdResolve, AddonIdType } from '../types/resource-id-resolver.types.js'
 * @import { CcApiClient } from '../cc-api-client.js'
 * @import { GetOrganisationSummariesCommandOutput } from '../commands/organisation/get-organisation-summaries-command.types.js'
 * @import { ResourceId, AddonId } from '../types/cc-api.types.js'
 * @import { CcRequestConfig } from '../../../types/request.types.js'
 */
import { CcClientError } from '../../../lib/error/cc-client-errors.js';
import { GetOrganisationSummariesCommand } from '../commands/organisation/get-organisation-summaries-command.js';

/**
 *
 */
export class ResourceIdResolver {
  /** @type {CcApiClient} */
  #client;
  /** @type {Store<ResourceIdIndex>} */
  #indexStore;
  /** @type {ResourceIdIndex} */
  #index;

  /**
   * @param {CcApiClient} client
   * @param {Store<ResourceIdIndex>} indexStore
   */
  constructor(client, indexStore) {
    this.#client = client;
    this.#indexStore = indexStore;
  }

  /**
   * @param {ResourceId} resourceId
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<string>}
   */
  async resolveOwnerId(resourceId, requestConfig) {
    const resolved = await this.#resolveOwnerId(resourceId, requestConfig);

    if (resolved.ownerId == null) {
      throw new CcClientError(
        `The ${resolved.kind} with id ${resolved.id} doesn't exist or you don't have access to it`,
        'CANNOT_RESOLVE_RESOURCE_ID',
      );
    }

    return resolved.ownerId;
  }

  /**
   * @param {string} addonId
   * @param {AddonIdType} requiredAddonIdType
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<string>}
   */
  async resolveAddonId(addonId, requiredAddonIdType, requestConfig) {
    if (addonId == null) {
      return null;
    }

    const resolvedAddonId = await this.#resolveAddonId(addonId, requiredAddonIdType, requestConfig);

    if (resolvedAddonId == null) {
      throw new CcClientError(
        `The addon with id ${addonId} doesn't exist or you don't have access to it`,
        'CANNOT_RESOLVE_RESOURCE_ID',
      );
    }

    return resolvedAddonId;
  }

  //-- Private methods ------

  /**
   * @param {ResourceId} resourceId
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<{id: string, kind: 'this'|'application'|'addon'|'addon provider'|'oauth consumer', ownerId: string}>}
   */
  async #resolveOwnerId(resourceId, requestConfig) {
    if (resourceId.ownerId != null) {
      return {
        id: resourceId.ownerId,
        kind: 'this',
        ownerId: resourceId.ownerId,
      };
    }

    if ('applicationId' in resourceId) {
      return {
        id: resourceId.applicationId,
        kind: 'application',
        ownerId: await this.#resolve(
          () => this.#index.ownerIdIndex.applicationIds,
          resourceId.applicationId,
          requestConfig,
        ),
      };
    }

    if ('addonProviderId' in resourceId) {
      return {
        id: resourceId.addonProviderId,
        kind: 'addon provider',
        ownerId: await this.#resolve(
          () => this.#index.ownerIdIndex.addonProviderIds,
          resourceId.addonProviderId,
          requestConfig,
        ),
      };
    }

    if ('oauthConsumerKey' in resourceId) {
      return {
        id: resourceId.oauthConsumerKey,
        kind: 'oauth consumer',
        ownerId: await this.#resolve(
          () => this.#index.ownerIdIndex.oauthConsumerIds,
          resourceId.oauthConsumerKey,
          requestConfig,
        ),
      };
    }

    if ('addonId' in resourceId) {
      const addonId = resourceId.addonId;
      if (getAddonIdType(addonId) === 'ADDON_ID') {
        return {
          id: addonId,
          kind: 'addon',
          ownerId: await this.#resolve(() => this.#index.ownerIdIndex.addonIds, addonId, requestConfig),
        };
      }
      return {
        id: addonId,
        kind: 'addon',
        ownerId: await this.#resolve(() => this.#index.ownerIdIndex.addonRealIds, addonId, requestConfig),
      };
    }

    throw new CcClientError(`Cannot resolve ownerId from unsupported resource`, 'CANNOT_RESOLVE_OWNER_ID');
  }

  /**
   * @param {string} addonId
   * @param {AddonIdType} requiredAddonIdType
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<string>}
   */
  async #resolveAddonId(addonId, requiredAddonIdType, requestConfig) {
    if (addonId == null) {
      return null;
    }
    const addonIdType = getAddonIdType(addonId);

    if (addonIdType === requiredAddonIdType) {
      return addonId;
    }

    if (addonIdType === 'ADDON_ID') {
      return await this.#resolve(() => this.#index.addonsIndex.addonIds, addonId, requestConfig);
    }

    return await this.#resolve(() => this.#index.addonsIndex.addonRealIds, addonId, requestConfig);
  }

  /**
   * @param {() => Record<string, string>} index
   * @param {string} id
   * @param {Partial<CcRequestConfig>} [requestConfig]
   * @returns {Promise<string>}
   */
  async #resolve(index, id, requestConfig) {
    await this.#init();

    let resolvedId = index()[id];
    if (resolvedId == null) {
      await this.#fetchAndStore(requestConfig);
      resolvedId = index()[id];
    }

    return resolvedId;
  }

  async #init() {
    if (this.#index == null) {
      this.#index = (await this.#indexStore.read()) ?? this.#createEmptyIndex();
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
    this.#index = this.#createEmptyIndex();

    for (const organisation of summaries) {
      organisation.applications?.forEach((application) => {
        this.#index.ownerIdIndex.applicationIds[application.id] = organisation.id;
      });
      organisation.addons?.forEach((addon) => {
        this.#index.ownerIdIndex.addonIds[addon.id] = organisation.id;
        this.#index.ownerIdIndex.addonRealIds[addon.realId] = organisation.id;
        this.#index.addonsIndex.addonIds[addon.id] = addon.realId;
        this.#index.addonsIndex.addonRealIds[addon.realId] = addon.id;
      });
      organisation.providers?.forEach((provider) => {
        this.#index.ownerIdIndex.addonProviderIds[provider.id] = organisation.id;
      });
      organisation.consumers?.forEach((consumer) => {
        this.#index.ownerIdIndex.oauthConsumerIds[consumer.key] = organisation.id;
      });
    }
  }

  /**
   * @returns {ResourceIdIndex}
   */
  #createEmptyIndex() {
    return {
      ownerIdIndex: {
        applicationIds: {},
        addonIds: {},
        addonRealIds: {},
        addonProviderIds: {},
        oauthConsumerIds: {},
      },
      addonsIndex: {
        addonIds: {},
        addonRealIds: {},
      },
    };
  }
}

/**
 * @param {string} id
 * @returns {AddonIdType}
 */
function getAddonIdType(id) {
  return id.startsWith('addon_') ? 'ADDON_ID' : 'REAL_ADDON_ID';
}
