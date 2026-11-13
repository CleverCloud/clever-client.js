import fs from 'node:fs';
import type { Store } from '../../types/resource-id-resolver.types.ts';

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
  private _filePath: string;

  /**
   * Creates a new file-based store
   *
   * @param filePath - Absolute path to the JSON file to use for storage
   */
  constructor(filePath: string) {
    this._filePath = filePath;
  }

  /**
   * Writes data to the file in JSON format
   *
   * @param index - Data to store
   * @throws {Error} If writing to the file fails
   */
  write(index: T): void {
    fs.writeFileSync(this._filePath, JSON.stringify(index));
  }

  /**
   * Reads and parses data from the file
   *
   * @returns The stored data, or null if file doesn't exist
   * @throws {Error} If reading or parsing the file fails
   */
  read(): T | undefined {
    if (fs.existsSync(this._filePath)) {
      return JSON.parse(fs.readFileSync(this._filePath).toString()) as T;
    }
    return undefined;
  }

  /**
   * Deletes the storage file if it exists
   *
   * @throws {Error} If deleting the file fails
   */
  flush(): void {
    if (fs.existsSync(this._filePath)) {
      fs.unlinkSync(this._filePath);
    }
  }
}
