/**
 * @import { CcRequestConfig, CcRequestConfigPartial, RequestCachePolicy } from '../types/request.types.js'
 */

/**
 * Creates a new object with the specified properties omitted.
 *
 * @param {T} obj - The source object to create a subset from
 * @param {Array<K>} keys - The property keys to omit from the result
 * @returns {Omit<T, K>} A new object without the specified keys
 * @template {object} T - Type of the source object
 * @template {keyof T} K - Type of the keys to omit
 *
 * @example
 * const user = { name: 'John', age: 30, password: 'secret' };
 * const safeUser = omit(user, 'password');
 * // Result: { name: 'John', age: 30 }
 */
export function omit(obj, ...keys) {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * Ensures a value is an array. If the input is already an array, returns it as-is;
 * otherwise, wraps the input in an array.
 *
 * @param {T | Array<T>} value - The value to convert to an array
 * @returns {Array<T>} An array containing the input value(s)
 * @template T - Type of the array elements
 *
 * @example
 * toArray(5)        // [5]
 * toArray([1, 2])   // [1, 2]
 */
export function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

/**
 * Normalizes various date formats into an ISO string representation.
 * Handles Date objects, timestamps, and string dates including those with '[UTC]' suffix.
 *
 * @param {Date|string|number} date - The date to normalize
 * @returns {string|null} The date in ISO string format, or null if input is null/undefined
 * @throws {Error} If the input cannot be parsed as a valid date
 *
 * @example
 * normalizeDate(new Date('2023-01-01'))     // '2023-01-01T00:00:00.000Z'
 * normalizeDate('2023-01-01[UTC]')          // '2023-01-01T00:00:00.000Z'
 * normalizeDate(1672531200000)              // '2023-01-01T00:00:00.000Z'
 */
export function normalizeDate(date) {
  if (date == null) {
    return null;
  }

  let parsedDate;

  if (date instanceof Date) {
    parsedDate = date;
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else if (typeof date === 'string') {
    // remove potential '[UTC]' suffix
    let fixedDateString = date.replace(/(.+)(\[UTC])/g, '$1');

    parsedDate = new Date(fixedDateString);
  }

  if (parsedDate != null) {
    return parsedDate.toISOString();
  }

  throw new Error(`Invalid date: ${date}`);
}

/**
 * Generates a cryptographically secure random UUID using the crypto module.
 *
 * @returns {Promise<string>} A Promise that resolves to a random UUID v4
 *
 * @example
 * const id = await randomUUID();
 * // Result: '123e4567-e89b-12d3-a456-426614174000'
 */
export async function randomUUID() {
  return crypto.randomUUID();
}

/**
 * Creates a safe URL by automatically encoding interpolated values using `encodeURIComponent()`.
 * Uses template literal syntax for clean and safe URL construction.
 * String values are URL-encoded while other types are converted to strings.
 *
 * @param {TemplateStringsArray} strings - The string literals from the template
 * @param {Array<?>} values - The interpolated values to be encoded
 * @returns {string} The safely constructed URL string
 *
 * @example
 * const name = 'John Doe';
 * const id = 123;
 * const url = safeUrl`/users/${name}/profile/${id}`;
 * // Result: '/users/John%20Doe/profile/123'
 */
export function safeUrl(strings, ...values) {
  let result = '';

  strings.forEach((string, index) => {
    result += string + encode(values[index]);
  });

  return result;
}

/**
 * Encodes a string to base64 with proper UTF-8 handling.
 * Safely handles non-ASCII characters by first encoding to UTF-8
 * before performing the base64 transformation.
 *
 * @param {string} string - The string to encode
 * @returns {string} The base64 encoded string
 *
 * @example
 * encodeToBase64('Hello 世界');
 * // Result: 'SGVsbG8g5LiW55WM'
 */
export function encodeToBase64(string) {
  // encode string to utf-8
  const bytes = new TextEncoder().encode(string);
  // convert bytes into string
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
  // encode into base64
  return btoa(binString);
}

/**
 * Sorts an array of objects by multiple keys with customizable sort order.
 * Supports both direct property access and custom getter functions.
 *
 * @param {Array<T>} array - The array to sort
 * @param {Array<K|{key: K, order: 'asc'|'desc'}>} keys - Sort keys or objects with key and order
 * @return {Array<T>} A new sorted array
 * @template {object} T - Type of array elements
 * @template {keyof T|((item: T) => any)} K - Property key or getter function
 *
 * @example
 * // Sort by property keys
 * const users = [
 *   { name: 'John', age: 30 },
 *   { name: 'Alice', age: 30 }
 * ];
 * sortBy(users, 'age', { key: 'name', order: 'desc' });
 * // Result: [{ name: 'John', age: 30 }, { name: 'Alice', age: 30 }]
 *
 * // Sort using custom getter function
 * const items = [
 *   { date: '2023-01-01' },
 *   { date: '2024-01-01' }
 * ];
 * sortBy(items, item => new Date(item.date));
 * // Result: [{ date: '2023-01-01' }, { date: '2024-01-01' }]
 */
export function sortBy(array, ...keys) {
  if (array.length === 0) {
    return [];
  }

  return [...array].sort((a, b) => {
    for (const keyDefinition of keys) {
      /** @type {keyof T|((item: T) => any)} */
      const key = typeof keyDefinition === 'object' ? keyDefinition.key : keyDefinition;
      /** @type {(item: T) => any} */
      const getter = typeof key === 'function' ? key : (item) => item[key];

      const order = typeof keyDefinition === 'object' ? keyDefinition.order : 'asc';
      const orderFactor = order === 'asc' ? 1 : -1;

      const first = getter(a);
      const second = getter(b);
      if (first < second) {
        return orderFactor * -1;
      }
      if (first > second) {
        return orderFactor * 1;
      }
    }
    return 0;
  });
}

/**
 * Merges two objects while ignoring null properties from the second object.
 * Useful for partial updates where null values should not override existing values.
 *
 * @param {T} object1 - The base object to merge into
 * @param {Partial<T>|null} object2 - The object with updates (can be null)
 * @returns {T} A new merged object
 * @template T - Type of the objects
 *
 * @example
 * const user = { name: 'John', age: 30 };
 * const update = { name: null, age: 31 };
 * merge(user, update);
 * // Result: { name: 'John', age: 31 }
 */
export function merge(object1, object2) {
  const o2 = object2 == null ? {} : pickNonNull(object2);
  return { ...object1, ...o2 };
}

/**
 * Creates a new object with all null or undefined properties removed.
 *
 * @param {T} object - The source object to clean
 * @returns {Partial<T>} A new object without null/undefined properties
 * @template T - Type of the object
 *
 * @example
 * const obj = { a: 1, b: null, c: undefined, d: 0 };
 * pickNonNull(obj);
 * // Result: { a: 1, d: 0 }
 */
export function pickNonNull(object) {
  /** @type {T} */
  const result = { ...object };

  for (const key in result) {
    if (result[key] == null) {
      delete result[key];
    }
  }

  return result;
}

/**
 * Combines an external AbortSignal with an AbortController's signal.
 *
 * This utility function allows chaining abort signals so that when the external
 * signal is aborted, it automatically aborts the provided AbortController as well.
 * This is useful for creating hierarchical cancellation where a parent operation
 * can cancel child operations.
 *
 * The function safely handles cases where:
 * - The external signal is null/undefined (no-op)
 * - The signals are the same instance (no-op to prevent infinite loops)
 * - The external signal is already aborted (immediate abortion)
 *
 * @param {AbortController} abortController - The AbortController to abort when signal is aborted
 * @param {AbortSignal} signal - External signal to listen for abort events
 *
 * @example
 * const parentController = new AbortController();
 * const childController = new AbortController();
 *
 * // When parent is aborted, child will also be aborted
 * combineWithSignal(childController, parentController.signal);
 *
 * // Later, aborting parent will also abort child
 * parentController.abort(); // childController.signal.aborted === true
 */
export function combineWithSignal(abortController, signal) {
  // TODO: use AbortSignal.any static method when it becomes widely available
  if (signal != null && abortController.signal !== signal) {
    signal.addEventListener('abort', () => abortController.abort(), { once: true });
  }
}

/**
 * @param {CcRequestConfig} baseConfig
 * @param {CcRequestConfigPartial|null} config
 * @return {CcRequestConfig}
 */
export function mergeRequestConfig(baseConfig, config) {
  /** @type {CcRequestConfigPartial} */
  const overrideConfig = config ?? {};

  return {
    ...baseConfig,
    ...overrideConfig,
    cache: mergeCache(baseConfig.cache, overrideConfig.cache),
  };
}

/**
 * @param {CcRequestConfigPartial|null} baseConfig
 * @param {CcRequestConfigPartial|null} config
 * @return {CcRequestConfigPartial}
 */
export function mergeRequestConfigPartial(baseConfig, config) {
  /** @type {CcRequestConfigPartial} */
  const bConfig = baseConfig ?? {};
  /** @type {CcRequestConfigPartial} */
  const overrideConfig = config ?? {};

  const result = {
    ...bConfig,
    ...overrideConfig,
    cache: mergeCachePartial(bConfig.cache, overrideConfig.cache),
  };
  if (result.cache === undefined) {
    delete result.cache;
  }
  return result;
}

/**
 * A Promise wrapper that provides external resolve/reject capabilities.
 *
 * @template T The type of the value that the promise will resolve to
 */
export class Deferred {
  /** @type {Promise<T>} */
  #promise;
  /** @type {(value: T) => void} */
  #resolve;
  /** @type {(error: any) => void} */
  #reject;

  constructor() {
    this.#promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  get promise() {
    return this.#promise;
  }

  get resolve() {
    return this.#resolve;
  }

  get reject() {
    return this.#reject;
  }
}

/**
 * Safely encodes a value for URL inclusion.
 * String values are URL-encoded, other types are converted to string,
 * and null/undefined become empty string.
 *
 * @param {?|null} value - The value to encode
 * @returns {string} The encoded string
 *
 * @example
 * encode('Hello World') // 'Hello%20World'
 * encode(123)           // '123'
 * encode(null)          // ''
 */
function encode(value) {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return encodeURIComponent(value);
  }

  return String(value);
}

/**
 * @param {RequestCachePolicy|null} baseCache
 * @param {Partial<RequestCachePolicy>|null|undefined} cache
 * @return {RequestCachePolicy|null}
 */
function mergeCache(baseCache, cache) {
  if (cache === undefined) {
    return baseCache;
  }
  if (cache == null) {
    return null;
  }
  return { ...(baseCache ?? { ttl: 0 }), ...cache };
}

/**
 * @param {Partial<RequestCachePolicy>|null|undefined} baseCache
 * @param {Partial<RequestCachePolicy>|null|undefined} cache
 * @return {Partial<RequestCachePolicy>|null}
 */
function mergeCachePartial(baseCache, cache) {
  if (cache === undefined) {
    return baseCache;
  }
  if (cache == null) {
    return null;
  }
  return { ...(baseCache ?? {}), ...cache };
}
