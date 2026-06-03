import type { Store } from '../../types/resource-id-resolver.types.js';

//--

/**
 * Browser localStorage-based implementation of the Store interface.
 * Persists data in the browser's localStorage, making it available across page reloads.
 *
 * @template T - The type of data to be stored
 *
 * @example
 * const store = new LocalStorageStore('my-app-data');
 * await store.write({ key: 'value' });
 * const data = await store.read();
 * await store.flush(); // Removes data from localStorage
 *
 * @throws {Error} If localStorage is not available in the environment
 */
export class LocalStorageStore<T> implements Store<T> {
  /**
   * Key used to store data in localStorage
   */
  #storageKey: string;

  /**
   * Creates a new localStorage-based store
   *
   * @param storageKey - Key to use in localStorage
   * @throws {Error} If localStorage is not available
   */
  constructor(storageKey = 'cc-resource-id-index') {
    if (localStorage == null) {
      throw new Error('LocalStorage is not available');
    }

    this.#storageKey = storageKey;
  }

  /**
   * Writes data to localStorage in JSON format
   *
   * @param index - Data to store
   * @throws {Error} If writing to localStorage fails or if data cannot be stringified
   */
  write(index: T): void {
    localStorage.setItem(this.#storageKey, JSON.stringify(index));
  }

  /**
   * Reads and parses data from localStorage
   *
   * @returns The stored data, or null if no data exists
   * @throws {Error} If reading from localStorage fails or if data cannot be parsed
   */
  read(): T | null {
    const item = localStorage.getItem(this.#storageKey);
    if (item != null) {
      return JSON.parse(item) as T;
    }
    return null;
  }

  /**
   * Removes the stored data from localStorage
   *
   * @throws {Error} If removing from localStorage fails
   */
  flush(): void {
    localStorage.removeItem(this.#storageKey);
  }
}
