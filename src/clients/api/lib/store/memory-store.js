/**
 * @import { Store } from '../../types/owner-id-resolver.types.js'
 */

//--

/**
 * @extends {Store<T>}
 * @template T
 */
export class MemoryStore {
  /** @type {T} */
  #index;

  /**
   * @param {T} index
   */
  async write(index) {
    this.#index = index;
  }

  /**
   * @returns {Promise<T>}
   */
  async read() {
    return this.#index;
  }

  async flush() {
    this.#index = null;
  }
}
