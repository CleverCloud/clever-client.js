import type { Store } from '../../types/resource-id-resolver.types.js';

//--

/**
 * In-memory implementation of the Store interface.
 * Stores data in memory, which means it will be lost when the application restarts.
 * This is the simplest and fastest storage implementation, suitable for temporary data.
 *
 * @template T - The type of data to be stored
 *
 * @example
 * const store = new MemoryStore();
 * await store.write({ key: 'value' });
 * const data = await store.read();
 * await store.flush(); // Clears the stored data
 */
export class MemoryStore<T> implements Store<T> {
  /**
   * The stored data
   */
  #index: T;

  /**
   * Stores data in memory
   *
   * @param index - Data to store
   */
  async write(index: T): Promise<void> {
    this.#index = index;
  }

  /**
   * Retrieves the stored data from memory
   *
   * @returns The stored data, or null if no data has been stored
   */
  async read(): Promise<T | null> {
    return this.#index;
  }

  /**
   * Clears the stored data from memory
   */
  async flush(): Promise<void> {
    this.#index = null;
  }
}
