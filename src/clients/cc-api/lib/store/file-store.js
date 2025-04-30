/**
 * @import { Store } from '../../types/resource-id-resolver.types.js'
 */
import fs from 'node:fs';

/**
 * File-based implementation of the Store interface.
 * Persists data to a JSON file on the filesystem.
 *
 * @extends {Store<T>}
 * @template T - The type of data to be stored
 *
 * @example
 * const store = new FileStore('/path/to/store.json');
 * await store.write({ key: 'value' });
 * const data = await store.read();
 * await store.flush(); // Deletes the file
 */
export class FileStore {
  /**
   * Path to the JSON file where data will be stored
   * @type {string}
   */
  #filePath;

  /**
   * Creates a new file-based store
   *
   * @param {string} filePath - Absolute path to the JSON file to use for storage
   */
  constructor(filePath) {
    this.#filePath = filePath;
  }

  /**
   * Writes data to the file in JSON format
   *
   * @param {T} index - Data to store
   * @returns {Promise<void>}
   * @throws {Error} If writing to the file fails
   */
  async write(index) {
    fs.writeFileSync(this.#filePath, JSON.stringify(index));
  }

  /**
   * Reads and parses data from the file
   *
   * @returns {Promise<T|null>} The stored data, or null if file doesn't exist
   * @throws {Error} If reading or parsing the file fails
   */
  async read() {
    if (fs.existsSync(this.#filePath)) {
      return JSON.parse(fs.readFileSync(this.#filePath).toString());
    }
    return null;
  }

  /**
   * Deletes the storage file if it exists
   *
   * @returns {Promise<void>}
   * @throws {Error} If deleting the file fails
   */
  async flush() {
    if (fs.existsSync(this.#filePath)) {
      fs.unlinkSync(this.#filePath);
    }
  }
}
