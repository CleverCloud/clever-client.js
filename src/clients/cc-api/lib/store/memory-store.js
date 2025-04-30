/**
 * @import { Store } from '../../types/resource-id-resolver.types.js'
 */

//--

/**
 * In-memory implementation of the Store interface.
 * Stores data in memory, which means it will be lost when the application restarts.
 * This is the simplest and fastest storage implementation, suitable for temporary data.
 *
 * @extends {Store<T>}
 * @template T - The type of data to be stored
 *
 * @example
 * const store = new MemoryStore();
 * await store.write({ key: 'value' });
 * const data = await store.read();
 * await store.flush(); // Clears the stored data
 */
export class MemoryStore {
  /**
   * The stored data
   * @type {T}
   */
  #index;

  /**
   * Stores data in memory
   *
   * @param {T} index - Data to store
   * @returns {Promise<void>}
   */
  async write(index) {
    this.#index = index;
  }

  /**
   * Retrieves the stored data from memory
   *
   * @returns {Promise<T|null>} The stored data, or null if no data has been stored
   */
  async read() {
    return this.#index;
  }

  /**
   * Clears the stored data from memory
   *
   * @returns {Promise<void>}
   */
  async flush() {
    this.#index = null;
  }
}
