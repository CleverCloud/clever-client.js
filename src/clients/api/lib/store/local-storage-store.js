/**
 * @import { Store } from '../../types/owner-id-resolver.types.js'
 */

//--

/**
 * @extends {Store<T>}
 * @template T
 */
export class LocalStorageStore {
  /** @type {string} */
  #storageKey;

  /**
   * @param {string} [storageKey]
   */
  constructor(storageKey = 'cc-client-owner-id-index') {
    if (localStorage == null) {
      throw new Error('LocalStorage is not available');
    }

    this.#storageKey = storageKey;
  }

  /**
   * @param {T} index
   */
  async write(index) {
    localStorage.setItem(this.#storageKey, JSON.stringify(index));
  }

  /**
   * @returns {Promise<T>}
   */
  async read() {
    const item = localStorage.getItem(this.#storageKey);
    if (item != null) {
      return JSON.parse(item);
    }
    return null;
  }

  async flush() {
    localStorage.removeItem(this.#storageKey);
  }
}
