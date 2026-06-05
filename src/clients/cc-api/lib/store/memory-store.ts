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
  #index: T | undefined;

  /**
   * Stores data in memory
   *
   * @param index - Data to store
   */
  write(index: T): void {
    this.#index = index;
  }

  /**
   * Retrieves the stored data from memory
   *
   * @returns The stored data, or null if no data has been stored
   */
  read(): T | undefined {
    return this.#index;
  }

  /**
   * Clears the stored data from memory
   */
  flush(): void {
    this.#index = undefined;
  }
}
