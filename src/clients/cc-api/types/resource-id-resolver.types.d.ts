export interface ResourceIdIndex {
  ownerIdIndex: OwnerIdIndex;
  addonsIndex: AddonIdIndex;
}

export interface OwnerIdIndex {
  applicationIds: Record<string, string>;
  addonIds: Record<string, string>;
  addonRealIds: Record<string, string>;
  addonProviderIds: Record<string, string>;
  oauthConsumerIds: Record<string, string>;
}

export interface AddonIdIndex {
  addonIds: Record<string, string>;
  addonRealIds: Record<string, string>;
}

/**
 * Interface for persistent storage implementations.
 * Provides a common API for different storage backends (file, localStorage, memory).
 *
 * @template T - The type of data to be stored
 *
 * @example
 * class MyStore implements Store<MyData> {
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
 */
export interface Store<T> {
  /**
   * Writes data to the store.
   *
   * @param index - The data to store
   * @returns A promise that resolves when the write is complete
   * @throws {Error} If writing to the store fails
   */
  write(index: T): Promise<void>;

  /**
   * Reads data from the store.
   *
   * @returns A promise that resolves with the stored data, or null if no data exists
   * @throws {Error} If reading from the store fails
   */
  read(): Promise<T | null>;

  /**
   * Removes all data from the store.
   *
   * @returns A promise that resolves when the flush is complete
   * @throws {Error} If clearing the store fails
   */
  flush(): Promise<void>;
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
