/**
 * @param {T} obj
 * @param {Array<K>} keys
 * @returns {Omit<T, K>}
 * @template {object} T
 * @template {keyof T} K
 */
export function omit(obj, ...keys) {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * @param {T | Array<T>} value
 * @returns {Array<T>}
 * @template T
 */
export function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

/**
 * @param {Date|string|number} date
 * @returns {string|null}
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
    const cleanedDate = date.replace(/(.+)(\[UTC\])/g, '$1');
    parsedDate = new Date(cleanedDate);
  }

  if (parsedDate != null) {
    return parsedDate.toISOString();
  }

  throw new Error(`Invalid date: ${date}`);
}

/**
 * @returns {Promise<string>}
 */
export async function randomUUID() {
  const cryptoModule = crypto ?? (await import('node:crypto'));
  return cryptoModule.randomUUID();
}

/**
 * Create a safe URL where every value is automatically encoded with the `encodeURIComponent()` function.
 *
 * Note that only string values are encoded. Other types are just converted to string.
 *
 * @param {TemplateStringsArray} strings
 * @param {Array<?>} values
 * @returns {string}
 */
export function safeUrl(strings, ...values) {
  let result = '';

  strings.forEach((string, index) => {
    result += string + encode(values[index]);
  });

  return result;
}

/**
 * Encodes the given string into base64, and take care of non-ASCII chars by encoding to utf8 before transforming to base64
 * @param {string} string
 * @returns {string}
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
 * @param {Array<T>} array
 * @param {keyof T} key
 * @return {Array<T>}
 * @template {object} T
 */
export function sortBy(array, key) {
  return [...array].sort((a, b) => {
    const first = a[key];
    const second = b[key];
    if (first < second) {
      return -1;
    }
    if (first > second) {
      return 1;
    }

    return 0;
  });
}

/**
 * @param {?|null} value
 * @returns {string}
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
