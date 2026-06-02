import fs from 'node:fs';
import type { Store } from '../../types/resource-id-resolver.types.js';

/**
 * File-based implementation of the Store interface.
 * Persists data to a JSON file on the filesystem.
 *
 * @template T - The type of data to be stored
 *
 * @example
 * const store = new FileStore('/path/to/store.json');
 * await store.write({ key: 'value' });
 * const data = await store.read();
 * await store.flush(); // Deletes the file
 */
export class FileStore<T> implements Store<T> {
  /**
   * Path to the JSON file where data will be stored
   */
  #filePath: string;

  /**
   * Creates a new file-based store
   *
   * @param filePath - Absolute path to the JSON file to use for storage
   */
  constructor(filePath: string) {
    this.#filePath = filePath;
  }

  /**
   * Writes data to the file in JSON format
   *
   * @param index - Data to store
   * @throws {Error} If writing to the file fails
   */
  async write(index: T): Promise<void> {
    fs.writeFileSync(this.#filePath, JSON.stringify(index));
  }

  /**
   * Reads and parses data from the file
   *
   * @returns The stored data, or null if file doesn't exist
   * @throws {Error} If reading or parsing the file fails
   */
  async read(): Promise<T | null> {
    if (fs.existsSync(this.#filePath)) {
      return JSON.parse(fs.readFileSync(this.#filePath).toString()) as T;
    }
    return null;
  }

  /**
   * Deletes the storage file if it exists
   *
   * @throws {Error} If deleting the file fails
   */
  async flush(): Promise<void> {
    if (fs.existsSync(this.#filePath)) {
      fs.unlinkSync(this.#filePath);
    }
  }
}
