import type {
  CcRequestConfig,
  CcRequestConfigPartial,
  CcRequestParams,
  RequestCachePolicy,
} from '../types/request.types.js';

/**
 * Creates a new object with the specified properties omitted.
 *
 * @param obj - The source object to create a subset from
 * @param keys - The property keys to omit from the result
 * @returns A new object without the specified keys
 *
 * @example
 * const user = { name: 'John', age: 30, password: 'secret' };
 * const safeUser = omit(user, 'password');
 * // Result: { name: 'John', age: 30 }
 */
export function omit<T extends object, K extends keyof T>(obj: T, ...keys: Array<K>): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * Ensures a value is an array. If the input is already an array, returns it as-is;
 * otherwise, wraps the input in an array.
 *
 * @param value - The value to convert to an array
 * @returns An array containing the input value(s)
 *
 * @example
 * toArray(5)        // [5]
 * toArray([1, 2])   // [1, 2]
 */
export function toArray<T>(value: T | Array<T>): Array<T> {
  return Array.isArray(value) ? value : [value];
}

/**
 * Normalizes various date formats into an ISO string representation.
 * Handles Date objects, timestamps, and string dates including those with '[UTC]' suffix.
 *
 * @param date - The date to normalize
 * @returns The date in ISO string format, or null if input is null/undefined
 * @throws {Error} If the input cannot be parsed as a valid date
 *
 * @example
 * normalizeDate(new Date('2023-01-01'))     // '2023-01-01T00:00:00.000Z'
 * normalizeDate('2023-01-01[UTC]')          // '2023-01-01T00:00:00.000Z'
 * normalizeDate(1672531200000)              // '2023-01-01T00:00:00.000Z'
 */
export function normalizeDate(date: Date | string | number | null | undefined): string | null {
  if (date == null) {
    return null;
  }

  let parsedDate: Date | undefined;

  if (date instanceof Date) {
    parsedDate = date;
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else if (typeof date === 'string') {
    // remove potential '[UTC]' suffix
    const fixedDateString = date.replace(/(.+)(\[UTC])/g, '$1');

    parsedDate = new Date(fixedDateString);
  }

  if (parsedDate != null) {
    return parsedDate.toISOString();
  }

  throw new Error(`Invalid date: ${String(date)}`);
}

/**
 * Generates a cryptographically secure random UUID using the crypto module.
 *
 * @returns A Promise that resolves to a random UUID v4
 *
 * @example
 * const id = await randomUUID();
 * // Result: '123e4567-e89b-12d3-a456-426614174000'
 */
export function randomUUID(): Promise<string> {
  return Promise.resolve(crypto.randomUUID());
}

/**
 * Creates a safe URL by automatically encoding interpolated values using `encodeURIComponent()`.
 * Uses template literal syntax for clean and safe URL construction.
 * String values are URL-encoded while other types are converted to strings.
 *
 * @param strings - The string literals from the template
 * @param values - The interpolated values to be encoded
 * @returns The safely constructed URL string
 *
 * @example
 * const name = 'John Doe';
 * const id = 123;
 * const url = safeUrl`/users/${name}/profile/${id}`;
 * // Result: '/users/John%20Doe/profile/123'
 */
export function safeUrl(strings: TemplateStringsArray, ...values: Array<unknown>): string {
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
 * @param string - The string to encode
 * @returns The base64 encoded string
 *
 * @example
 * encodeToBase64('Hello 世界');
 * // Result: 'SGVsbG8g5LiW55WM'
 */
export function encodeToBase64(string: string): string {
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
 * @param array - The array to sort
 * @param keys - Sort keys or objects with key and order
 * @return A new sorted array
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
export function sortBy<T extends object, K extends keyof T | ((item: T) => unknown)>(
  array: Array<T>,
  ...keys: Array<K | { key: K; order: 'asc' | 'desc' }>
): Array<T> {
  if (array.length === 0) {
    return [];
  }

  return [...array].sort((a, b) => {
    for (const keyDefinition of keys) {
      const key = typeof keyDefinition === 'object' ? keyDefinition.key : keyDefinition;
      const getter: (item: T) => unknown = typeof key === 'function' ? key : (item) => item[key as keyof T];

      const order = typeof keyDefinition === 'object' ? keyDefinition.order : 'asc';
      const orderFactor = order === 'asc' ? 1 : -1;

      // Values are compared with relational operators; cast through the primitive form JS coerces to.
      const first = getter(a) as number;
      const second = getter(b) as number;
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
 * @param object1 - The base object to merge into
 * @param object2 - The object with updates (can be null)
 * @returns A new merged object
 *
 * @example
 * const user = { name: 'John', age: 30 };
 * const update = { name: null, age: 31 };
 * merge(user, update);
 * // Result: { name: 'John', age: 31 }
 */
export function merge<T>(object1: T, object2: Partial<T> | undefined): T {
  const o2 = object2 == null ? {} : pickNonNull(object2);
  return { ...object1, ...o2 };
}

/**
 * Creates a new object with all null or undefined properties removed.
 *
 * @param object - The source object to clean
 * @returns A new object without null/undefined properties
 *
 * @example
 * const obj = { a: 1, b: null, c: undefined, d: 0 };
 * pickNonNull(obj);
 * // Result: { a: 1, d: 0 }
 */
export function pickNonNull<T>(object: T): Partial<T> {
  const result = { ...object };

  for (const key in result) {
    if (result[key as keyof T] == null) {
      delete result[key as keyof T];
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
 * @param abortController - The AbortController to abort when signal is aborted
 * @param signal - External signal to listen for abort events
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
export function combineWithSignal(abortController: AbortController, signal: AbortSignal): void {
  // TODO: use AbortSignal.any static method when it becomes widely available
  if (signal != null && abortController.signal !== signal) {
    signal.addEventListener('abort', () => abortController.abort(), { once: true });
  }
}

export function mergeRequestConfig(
  baseConfig: CcRequestConfig,
  config: CcRequestConfigPartial | undefined,
): CcRequestConfig {
  const overrideConfig: CcRequestConfigPartial = config ?? {};

  return {
    ...baseConfig,
    ...overrideConfig,
    cache: mergeCache(baseConfig.cache, overrideConfig.cache),
  };
}

export function mergeRequestConfigPartial(
  baseConfig: CcRequestConfigPartial | undefined,
  config: CcRequestConfigPartial | undefined,
): CcRequestConfigPartial {
  const bConfig: CcRequestConfigPartial = baseConfig ?? {};
  const overrideConfig: CcRequestConfigPartial = config ?? {};

  const result: CcRequestConfigPartial = {
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
export class Deferred<T> {
  #promise: Promise<T>;
  #resolve!: (value: T) => void;
  #reject!: (error: unknown) => void;

  constructor() {
    this.#promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  get promise(): Promise<T> {
    return this.#promise;
  }

  get resolve(): (value: T) => void {
    return this.#resolve;
  }

  get reject(): (error: unknown) => void {
    return this.#reject;
  }
}

export function calculateCacheKey(requestParams: Partial<CcRequestParams>): string {
  const cacheParams = [
    requestParams.url,
    requestParams.queryParams?.toObject(),
    requestParams.headers?.get('accept'),
    requestParams.headers?.get('authorization'),
  ];
  return JSON.stringify(cacheParams);
}

/**
 * Safely encodes a value for URL inclusion.
 * String values are URL-encoded, other types are converted to string,
 * and null/undefined become empty string.
 *
 * @param value - The value to encode
 * @returns The encoded string
 *
 * @example
 * encode('Hello World') // 'Hello%20World'
 * encode(123)           // '123'
 * encode(null)          // ''
 */
function encode(value: unknown): string {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return encodeURIComponent(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string -- interpolated values are expected to be primitives that stringify meaningfully
  return String(value);
}

function mergeCache(
  baseCache: RequestCachePolicy | null,
  cache: Partial<RequestCachePolicy> | null | undefined,
): RequestCachePolicy | null {
  if (cache === undefined) {
    return baseCache;
  }
  if (cache == null) {
    return null;
  }
  return { ...(baseCache ?? { ttl: 0 }), ...cache };
}

function mergeCachePartial(
  baseCache: Partial<RequestCachePolicy> | null | undefined,
  cache: Partial<RequestCachePolicy> | null | undefined,
): Partial<RequestCachePolicy> | null | undefined {
  if (cache === undefined) {
    return baseCache;
  }
  if (cache == null) {
    return null;
  }
  return { ...(baseCache ?? {}), ...cache };
}
