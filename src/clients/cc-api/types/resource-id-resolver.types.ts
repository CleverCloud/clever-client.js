import type { SelfOrPromise } from '../../../types/utils.types.js';

/**
 * The cache the client keeps so it can fill in a resource's owner, and translate between the two
 * add-on id formats, without spending a request on it every time.
 */
export interface ResourceIdIndex {
  /** Maps each resource to the owner it belongs to. */
  ownerIdIndex: OwnerIdIndex;
  /** Maps the two add-on id formats onto each other. */
  addonsIndex: AddonIdIndex;
}

/**
 * Which owner each resource belongs to, keyed by resource id. Lets a command that was given only a
 * resource id resolve the `ownerId` its endpoint needs.
 */
export interface OwnerIdIndex {
  /** Owner of each application, keyed by application id. */
  applicationIds: Record<string, string>;
  /** Owner of each add-on, keyed by public add-on id. */
  addonIds: Record<string, string>;
  /** Owner of each add-on, keyed by provider-side add-on id. */
  addonRealIds: Record<string, string>;
  /** Owner of each add-on provider, keyed by provider id. */
  addonProviderIds: Record<string, string>;
  /** Owner of each OAuth consumer, keyed by consumer key. */
  oauthConsumerIds: Record<string, string>;
}

/**
 * The translation between an add-on's public id and its provider-side id, which different endpoints
 * expect.
 */
export interface AddonIdIndex {
  /** Provider-side id of each add-on, keyed by public add-on id. */
  addonIds: Record<string, string>;
  /** Public id of each add-on, keyed by provider-side add-on id. */
  addonRealIds: Record<string, string>;
}

/**
 * Interface for persistent storage implementations.
 * Provides a common API for different storage backends (file, localStorage, memory).
 *
 * @template T - The type of data to be stored
 *
 * Implementations may be synchronous or asynchronous: each method may return
 * its value directly or wrapped in a promise. Consumers should always `await`
 * the result so both kinds of backend work transparently.
 *
 * @example
 * // Asynchronous backend
 * class MyAsyncStore implements Store<MyData> {
 *   async write(data: MyData): Promise<void> {
 *     // Store the data
 *   }
 *
 *   async read(): Promise<MyData | null> {
 *     // Retrieve the data
 *   }
 *
 *   async flush(): Promise<void> {
 *     // Clear the data
 *   }
 * }
 *
 * @example
 * // Synchronous backend
 * class MySyncStore implements Store<MyData> {
 *   write(data: MyData): void {
 *     // Store the data
 *   }
 *
 *   read(): MyData | null {
 *     // Retrieve the data
 *   }
 *
 *   flush(): void {
 *     // Clear the data
 *   }
 * }
 */
export interface Store<T> {
  /**
   * Writes data to the store.
   *
   * @param index - The data to store
   * @returns Resolves (or returns) when the write is complete
   * @throws {Error} If writing to the store fails
   */
  write(index: T): SelfOrPromise<void>;

  /**
   * Reads data from the store.
   *
   * @returns The stored data, or null if no data exists
   * @throws {Error} If reading from the store fails
   */
  read(): SelfOrPromise<T | undefined>;

  /**
   * Removes all data from the store.
   *
   * @returns Resolves (or returns) when the flush is complete
   * @throws {Error} If clearing the store fails
   */
  flush(): SelfOrPromise<void>;
}

/**
 * Configuration for resource ID resolution in API commands.
 * Specifies which IDs in the command parameters need to be resolved.
 *
 * @example
 * // Resolve only owner ID
 * const resolve: IdResolve = { ownerId: true };
 *
 * // Resolve addon ID to real ID
 * const resolve: IdResolve = {
 *   addonId: 'REAL_ADDON_ID'
 * };
 *
 * // Resolve custom addon ID property
 * const resolve: IdResolve = {
 *   addonId: { property: 'providerId', type: 'ADDON_ID' }
 * };
 */
export interface IdResolve {
  /**
   * Whether to resolve the owner ID (organization ID) in the command parameters
   */
  ownerId?: boolean;

  /**
   * Configuration for addon ID resolution
   * Can be either:
   * - An AddonIdType to resolve the 'addonId' property
   * - An AddonIdResolve to specify a custom property and target type
   */
  addonId?: AddonIdType | AddonIdResolve;
}
/**
 * Type of addon ID format.
 * - ADDON_ID: The public ID format used in API requests
 * - REAL_ADDON_ID: The internal ID format used by the system
 */
export type AddonIdType = 'ADDON_ID' | 'REAL_ADDON_ID';
/**
 * Configuration for resolving a custom addon ID property.
 *
 * @example
 * // Resolve providerId to a real addon ID
 * const resolve: AddonIdResolve = {
 *   property: 'providerId',
 *   type: 'REAL_ADDON_ID'
 * };
 */
export type AddonIdResolve = {
  /**
   * Name of the property containing the addon ID to resolve
   */
  property: string;

  /**
   * Target format to resolve the ID to
   */
  type: AddonIdType;
};
