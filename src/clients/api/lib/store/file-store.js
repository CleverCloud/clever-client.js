/**
 * @import { Store } from '../../types/owner-id-resolver.types.js'
 */
import fs from 'node:fs';

/**
 * @extends {Store<T>}
 * @template T
 */
export class FileStore {
  /** @type {string} */
  #filePath;

  /**
   * @param {string} filePath
   */
  constructor(filePath) {
    this.#filePath = filePath;
  }

  /**
   * @param {T} index
   */
  async write(index) {
    fs.writeFileSync(this.#filePath, JSON.stringify(index));
  }

  /**
   * @returns {Promise<T>}
   */
  async read() {
    if (fs.existsSync(this.#filePath)) {
      return JSON.parse(fs.readFileSync(this.#filePath).toString());
    }
    return null;
  }

  async flush() {
    if (fs.existsSync(this.#filePath)) {
      fs.unlinkSync(this.#filePath);
    }
  }
}
