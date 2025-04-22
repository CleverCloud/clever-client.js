/**
 * @typedef {import('./owner-id-resolver.types.js').OwnerIdIndex} OwnerIdIndex
 * @typedef {import('./owner-id-resolver.types.js').OwnerIdIndexStore} OwnerIdIndexStore
 */

/**
 * @implements {OwnerIdIndexStore}
 */
export class MemoryIndexStore {
  /** @type {OwnerIdIndex} */
  #index;

  /**
   * @param {OwnerIdIndex} index
   */
  async write(index) {
    this.#index = index;
  }

  /**
   * @returns {Promise<OwnerIdIndex>}
   */
  async read() {
    return this.#index;
  }
}

/**
 * @implements {OwnerIdIndexStore}
 */
export class FileIndexStore {
  /** @type {string} */
  #filePath;

  /**
   * @param {string} filePath
   */
  constructor(filePath) {
    this.#filePath = filePath;
  }

  /**
   * @param {OwnerIdIndex} index
   */
  async write(index) {
    const fs = await import('node:fs');
    if (fs == null) {
      throw new Error('File system is not available');
    }
    fs.writeFileSync(this.#filePath, JSON.stringify(index));
  }

  /**
   * @returns {Promise<OwnerIdIndex>}
   */
  async read() {
    const fs = await import('node:fs');
    if (fs == null) {
      throw new Error('File system is not available');
    }
    if (fs.existsSync(this.#filePath)) {
      return JSON.parse(fs.readFileSync(this.#filePath).toString());
    }
    return null;
  }
}

/**
 * @implements {OwnerIdIndexStore}
 */
export class LocalStorageIndexStore {
  constructor() {
    if (localStorage == null) {
      throw new Error('LocalStorage is not available');
    }
  }

  /**
   * @param {OwnerIdIndex} index
   */
  async write(index) {
    localStorage.setItem('cc-client-owner-id-index', JSON.stringify(index));
  }

  /**
   * @returns {Promise<OwnerIdIndex>}
   */
  async read() {
    const item = localStorage.getItem('cc-client-owner-id-index');
    if (item != null) {
      return JSON.parse(item);
    }
    return null;
  }
}
