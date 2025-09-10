/**
 * @import { ResourceIdIndex, Store, AddonIdType } from '../types/resource-id-resolver.types.js'
 * @import { CcApiClient } from '../cc-api-client.js'
 * @import { GetOrganisationSummariesCommandOutput } from '../commands/organisation/get-organisation-summaries-command.types.js'
 * @import { ResourceId } from '../types/cc-api.types.js'
 * @import { CcRequestConfigPartial } from '../../../types/request.types.js'
 */
import { CcClientError } from '../../../lib/error/cc-client-errors.js';
import { GetOrganisationSummariesCommand } from '../commands/organisation/get-organisation-summaries-command.js';

/**
 * Utility class to resolve and translate between different types of resource IDs in the Clever Cloud API.
 * Maintains a cached index of ID mappings using a configurable storage backend.
 *
 * This resolver handles:
 * - Owner ID resolution for applications, addons, addon providers, and OAuth consumers
 * - Addon ID resolution between different ID formats (real IDs and addon IDs)
 *
 * @example
 * const client = new CcApiClient(config);
 * const store = new LocalStorageStore('resource-mappings');
 * const resolver = new ResourceIdResolver(client, store);
 *
 * // Resolve owner ID for an application
 * const ownerId = await resolver.resolveOwnerId({ applicationId: 'app_123' });
 *
 * // Resolve addon ID to its real ID
 * const realId = await resolver.resolveAddonId('addon_123', 'ADDON_REAL_ID');
 */
export class ResourceIdResolver {
  /**
   * API client used to fetch resource information
   * @type {CcApiClient}
   */
  #client;

  /**
   * Storage backend for the resource index
   * @type {Store<ResourceIdIndex>}
   */
  #indexStore;

  /**
   * In-memory cache of resource mappings
   * @type {ResourceIdIndex}
   */
  #index;

  /**
   * Creates a new ResourceIdResolver instance
   *
   * @param {CcApiClient} client - API client to use for fetching resource information
   * @param {Store<ResourceIdIndex>} indexStore - Storage backend for caching resource mappings
   */
  constructor(client, indexStore) {
    this.#client = client;
    this.#indexStore = indexStore;
  }

  /**
   * Resolves the owner ID (organization ID) for a given resource.
   * The resource can be an application, addon, addon provider, or OAuth consumer.
   *
   * @param {ResourceId} resourceId - The resource identifier to resolve
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<string>} The owner ID for the resource
   * @throws {CcClientError} If the resource doesn't exist or is inaccessible
   *
   * @example
   * // Resolve owner for an application
   * const ownerId = await resolver.resolveOwnerId({ applicationId: 'app_123' });
   *
   * // Resolve owner for an addon
   * const ownerId = await resolver.resolveOwnerId({ addonId: 'addon_123' });
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
   * Resolves an addon ID to either its real ID or addon ID format.
   * Addons can be identified by two types of IDs, and this method translates between them.
   *
   * @param {string} addonId - The addon ID to resolve
   * @param {AddonIdType} requiredAddonIdType - The desired ID format ('ADDON_ID' or 'ADDON_REAL_ID')
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<string>} The resolved addon ID in the requested format
   * @throws {CcClientError} If the addon doesn't exist or is inaccessible
   *
   * @example
   * // Convert addon ID to real ID
   * const realId = await resolver.resolveAddonId('addon_123', 'ADDON_REAL_ID');
   *
   * // Convert real ID to addon ID
   * const addonId = await resolver.resolveAddonId('real_123', 'ADDON_ID');
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
   * Internal method to resolve owner ID and resource metadata.
   * Handles different types of resources (applications, addons, etc.) and returns
   * both the resolved owner ID and information about the resource itself.
   *
   * @param {ResourceId} resourceId - The resource identifier to resolve
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<{id: string, kind: 'this'|'application'|'addon'|'addon provider'|'oauth consumer', ownerId: string}>}
   *          Object containing the resource ID, its kind, and resolved owner ID
   * @throws {CcClientError} If the resource type is not supported
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

    throw new CcClientError(`Cannot resolve ownerId from unsupported resource`, 'CANNOT_RESOLVE_RESOURCE_ID');
  }

  /**
   * Internal method to resolve between different addon ID formats.
   * Handles the actual resolution logic for translating between addon IDs and real IDs.
   *
   * @param {string} addonId - The addon ID to resolve
   * @param {AddonIdType} requiredAddonIdType - The desired ID format
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<string>} The resolved addon ID
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
   * Core resolution method that handles cache lookup and refresh.
   * If the ID is not found in the cache, it triggers a fetch of fresh data.
   *
   * @param {() => Record<string, string>} index - Function that returns the relevant index map
   * @param {string} id - The ID to resolve
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<string>} The resolved ID
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

  /**
   * Initializes the resolver by loading the index from storage.
   * If no stored index exists, creates an empty one.
   *
   * @returns {Promise<void>}
   */
  async #init() {
    if (this.#index == null) {
      this.#index = (await this.#indexStore.read()) ?? this.#createEmptyIndex();
    }
  }

  /**
   * Fetches fresh resource data from the API and updates the cache.
   * This is called when a requested ID is not found in the current cache.
   *
   * @param {CcRequestConfigPartial} [requestConfig] - Optional request configuration
   * @returns {Promise<void>}
   */
  async #fetchAndStore(requestConfig) {
    const summary = await this.#client.send(new GetOrganisationSummariesCommand(), {
      ...requestConfig,
      cache: { mode: 'reload' },
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
