import { CcClientError } from '../../../lib/error/cc-client-errors.js';
import type { CcRequestConfigPartial } from '../../../types/request.types.js';
import type { CcApiClient } from '../cc-api-client.js';
import { GetOrganisationSummaryCommand } from '../commands/organisation/get-organisation-summary-command.js';
import type { GetOrganisationSummaryCommandOutput } from '../commands/organisation/get-organisation-summary-command.types.js';
import type { ResourceId } from '../types/cc-api.types.js';
import type { AddonIdType, ResourceIdIndex, Store } from '../types/resource-id-resolver.types.js';

/**
 * A summary fetch shared by every caller resolving an id while it is pending.
 */
interface PendingSummaryFetch {
  promise: Promise<void>;
  abortController: AbortController;
  callerCount: number;
}

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
   */
  #client: CcApiClient;

  /**
   * Storage backend for the resource index
   */
  #indexStore: Store<ResourceIdIndex>;

  /**
   * In-memory cache of resource mappings
   */
  #index: ResourceIdIndex | undefined;

  /**
   * The store read currently in flight, shared by every concurrent caller so the index is only
   * loaded once. Cleared once it settles.
   */
  #pendingInit: Promise<void> | undefined;

  /**
   * The summary fetch currently in flight, shared by every concurrent caller so a burst of
   * unresolved ids only costs one request. Cleared once it settles, or once every caller left it.
   */
  #pendingFetch: PendingSummaryFetch | undefined;

  /**
   * Gets the signal a caller aborts with, from the request configuration it resolves an id with
   */
  #getRequestSignal: (requestConfig: CcRequestConfigPartial | undefined) => AbortSignal | undefined;

  /**
   * Creates a new ResourceIdResolver instance
   *
   * @param client - API client to use for fetching resource information
   * @param indexStore - Storage backend for caching resource mappings
   * @param getRequestSignal - Gets the signal a caller aborts with, from its request configuration. The
   * client passes one that falls back to its default signal. Defaults to the signal of the configuration.
   */
  constructor(
    client: CcApiClient,
    indexStore: Store<ResourceIdIndex>,
    getRequestSignal: (requestConfig: CcRequestConfigPartial | undefined) => AbortSignal | undefined = (
      requestConfig,
    ) => requestConfig?.signal,
  ) {
    this.#client = client;
    this.#indexStore = indexStore;
    this.#getRequestSignal = getRequestSignal;
  }

  /**
   * Resolves the owner ID (organization ID) for a given resource.
   * The resource can be an application, addon, addon provider, or OAuth consumer.
   *
   * @param resourceId - The resource identifier to resolve
   * @param requestConfig - Optional request configuration
   * @returns The owner ID for the resource
   * @throws {CcClientError} If the resource doesn't exist or is inaccessible
   *
   * @example
   * // Resolve owner for an application
   * const ownerId = await resolver.resolveOwnerId({ applicationId: 'app_123' });
   *
   * // Resolve owner for an addon
   * const ownerId = await resolver.resolveOwnerId({ addonId: 'addon_123' });
   */
  async resolveOwnerId(resourceId: ResourceId, requestConfig?: CcRequestConfigPartial): Promise<string> {
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
   * @param addonId - The addon ID to resolve
   * @param requiredAddonIdType - The desired ID format ('ADDON_ID' or 'ADDON_REAL_ID')
   * @param requestConfig - Optional request configuration
   * @returns The resolved addon ID in the requested format
   * @throws {CcClientError} If the addon doesn't exist or is inaccessible
   *
   * @example
   * // Convert addon ID to real ID
   * const realId = await resolver.resolveAddonId('addon_123', 'ADDON_REAL_ID');
   *
   * // Convert real ID to addon ID
   * const addonId = await resolver.resolveAddonId('real_123', 'ADDON_ID');
   */
  async resolveAddonId(
    addonId: string,
    requiredAddonIdType: AddonIdType,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<string> {
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
   * Returns the in-memory index, guarding against access before initialization.
   *
   * @returns The resource index
   * @throws {Error} If the index has not been initialized yet
   */
  #getIndex(): ResourceIdIndex {
    if (this.#index == null) {
      throw new Error('Resource id index has not been initialized');
    }
    return this.#index;
  }

  /**
   * Internal method to resolve owner ID and resource metadata.
   * Handles different types of resources (applications, addons, etc.) and returns
   * both the resolved owner ID and information about the resource itself.
   *
   * @param resourceId - The resource identifier to resolve
   * @param requestConfig - Optional request configuration
   * @returns Object containing the resource ID, its kind, and resolved owner ID
   * @throws {CcClientError} If the resource type is not supported
   */
  async #resolveOwnerId(
    resourceId: ResourceId,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<{
    id: string;
    kind: 'this' | 'application' | 'addon' | 'addon provider' | 'oauth consumer';
    ownerId: string;
  }> {
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
          () => this.#getIndex().ownerIdIndex.applicationIds,
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
          () => this.#getIndex().ownerIdIndex.addonProviderIds,
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
          () => this.#getIndex().ownerIdIndex.oauthConsumerIds,
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
          ownerId: await this.#resolve(() => this.#getIndex().ownerIdIndex.addonIds, addonId, requestConfig),
        };
      }
      return {
        id: addonId,
        kind: 'addon',
        ownerId: await this.#resolve(() => this.#getIndex().ownerIdIndex.addonRealIds, addonId, requestConfig),
      };
    }

    throw new CcClientError(`Cannot resolve ownerId from unsupported resource`, 'CANNOT_RESOLVE_RESOURCE_ID');
  }

  /**
   * Internal method to resolve between different addon ID formats.
   * Handles the actual resolution logic for translating between addon IDs and real IDs.
   *
   * @param addonId - The addon ID to resolve
   * @param requiredAddonIdType - The desired ID format
   * @param requestConfig - Optional request configuration
   * @returns The resolved addon ID
   */
  async #resolveAddonId(
    addonId: string,
    requiredAddonIdType: AddonIdType,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<string> {
    if (addonId == null) {
      return null as unknown as string;
    }
    const addonIdType = getAddonIdType(addonId);

    if (addonIdType === requiredAddonIdType) {
      return addonId;
    }

    if (addonIdType === 'ADDON_ID') {
      return await this.#resolve(() => this.#getIndex().addonsIndex.addonIds, addonId, requestConfig);
    }

    return await this.#resolve(() => this.#getIndex().addonsIndex.addonRealIds, addonId, requestConfig);
  }

  /**
   * Core resolution method that handles cache lookup and refresh.
   * If the ID is not found in the cache, it triggers a fetch of fresh data.
   *
   * @param index - Function that returns the relevant index map
   * @param id - The ID to resolve
   * @param requestConfig - Optional request configuration
   * @returns The resolved ID
   */
  async #resolve(
    index: () => Record<string, string>,
    id: string,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<string> {
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
   * Callers that arrive while the store is being read share that read instead of starting their
   * own.
   */
  async #init(): Promise<void> {
    if (this.#index != null) {
      return;
    }

    this.#pendingInit ??= this.#readIndex().finally(() => {
      this.#pendingInit = undefined;
    });

    return this.#pendingInit;
  }

  /**
   * Loads the index from storage, falling back to an empty one when the store holds nothing.
   */
  async #readIndex(): Promise<void> {
    this.#index = (await this.#indexStore.read()) ?? this.#createEmptyIndex();
  }

  /**
   * Fetches fresh resource data from the API and updates the cache.
   * This is called when a requested ID is not found in the current cache.
   *
   * Callers that arrive while a fetch is in flight share it, so resolving several unknown ids at
   * once costs one request instead of one per id. They therefore read a summary that was requested
   * just before they asked for it. A resource created during that window stays unresolved, which
   * is the same outcome as resolving it a few milliseconds earlier.
   *
   * The first caller's `requestConfig` applies to the shared request. That config cannot change
   * the response the others get, because this fetch always forces `cache: { mode: 'reload' }`.
   *
   * Its signal is the exception. The shared request runs on a signal of its own, and each caller
   * stops waiting when its own signal aborts. Once every caller left, the request is aborted, like the
   * request dedupe does: nobody waits for its result, and its failure has nobody to be reported to.
   *
   * A caller aborts with the signal its own requests would carry: the signal of its configuration, or
   * else the default signal of the client. A caller relying on that default signal leaves when it aborts.
   *
   * @param requestConfig - Optional request configuration
   */
  async #fetchAndStore(requestConfig?: CcRequestConfigPartial): Promise<void> {
    const signal = this.#getRequestSignal(requestConfig);

    // a caller that already gave up must not start a request nobody waits for
    signal?.throwIfAborted();

    const pendingFetch = this.#pendingFetch ?? this.#startFetch(requestConfig);
    pendingFetch.callerCount++;

    return waitUnlessAborted(pendingFetch.promise, signal, () => this.#leaveFetch(pendingFetch));
  }

  /**
   * Starts the summary fetch every caller arriving while it is pending shares.
   *
   * @param requestConfig - The request configuration of the caller starting it
   */
  #startFetch(requestConfig?: CcRequestConfigPartial): PendingSummaryFetch {
    // the request belongs to every caller joining it, so the signal of the first one must not abort it
    const abortController = new AbortController();
    const pendingFetch: PendingSummaryFetch = {
      promise: this.#fetchSummaryAndStore({ ...requestConfig, signal: abortController.signal }).finally(() => {
        // once every caller left, a new fetch may already have taken its place
        if (this.#pendingFetch === pendingFetch) {
          this.#pendingFetch = undefined;
        }
      }),
      abortController,
      callerCount: 0,
    };
    this.#pendingFetch = pendingFetch;

    return pendingFetch;
  }

  /**
   * Counts a caller that stopped waiting for the summary fetch, and aborts the fetch once none is left.
   *
   * @param pendingFetch - The fetch the caller was waiting for
   */
  #leaveFetch(pendingFetch: PendingSummaryFetch): void {
    pendingFetch.callerCount--;
    if (pendingFetch.callerCount === 0) {
      // nobody waits for it anymore: the next caller must start a new fetch rather than join this one
      if (this.#pendingFetch === pendingFetch) {
        this.#pendingFetch = undefined;
      }
      pendingFetch.abortController.abort();
    }
  }

  /**
   * Fetches the organisation summary, rebuilds the index from it and writes it to the store.
   *
   * @param requestConfig - Optional request configuration
   */
  async #fetchSummaryAndStore(requestConfig?: CcRequestConfigPartial): Promise<void> {
    const summary = await this.#client.send(new GetOrganisationSummaryCommand(), {
      ...requestConfig,
      cache: { mode: 'reload' },
    });
    this.#indexSummary(summary);
    return this.#indexStore.write(this.#getIndex());
  }

  #indexSummary(summary: GetOrganisationSummaryCommandOutput): void {
    this.#index = this.#createEmptyIndex();

    for (const organisation of summary.organisations) {
      organisation.applications?.forEach((application) => {
        this.#getIndex().ownerIdIndex.applicationIds[application.id] = organisation.id;
      });
      organisation.addons?.forEach((addon) => {
        this.#getIndex().ownerIdIndex.addonIds[addon.id] = organisation.id;
        this.#getIndex().ownerIdIndex.addonRealIds[addon.realId] = organisation.id;
        this.#getIndex().addonsIndex.addonIds[addon.id] = addon.realId;
        this.#getIndex().addonsIndex.addonRealIds[addon.realId] = addon.id;
      });
      if (!organisation.isPersonal) {
        organisation.providers?.forEach((provider) => {
          this.#getIndex().ownerIdIndex.addonProviderIds[provider.id] = organisation.id;
        });
      }
      organisation.consumers?.forEach((consumer) => {
        this.#getIndex().ownerIdIndex.oauthConsumerIds[consumer.key] = organisation.id;
      });
    }
  }

  #createEmptyIndex(): ResourceIdIndex {
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

function getAddonIdType(id: string): AddonIdType {
  return id.startsWith('addon_') ? 'ADDON_ID' : 'REAL_ADDON_ID';
}

/**
 * Waits for a promise shared with other callers, unless the signal of this caller aborts first.
 *
 * Aborting only stops this caller from waiting, and rejects it with the reason of its signal, as
 * `fetch()` does. The promise goes on for the other callers.
 *
 * @param promise - The shared promise to wait for
 * @param signal - The signal of this caller
 * @param onAbort - Called once this caller stopped waiting because its signal aborted
 */
function waitUnlessAborted<T>(promise: Promise<T>, signal: AbortSignal | undefined, onAbort?: () => void): Promise<T> {
  if (signal == null) {
    return promise;
  }

  return new Promise((resolve, reject) => {
    const abort = (): void => {
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- an abort rejects with whatever the caller aborted with, like `fetch()` does
      reject(signal.reason);
      onAbort?.();
    };

    if (signal.aborted) {
      abort();
      return;
    }

    signal.addEventListener('abort', abort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener('abort', abort);
        resolve(value);
      },
      (error: unknown) => {
        signal.removeEventListener('abort', abort);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- the error of the shared promise, passed on as is
        reject(error);
      },
    );
  });
}
