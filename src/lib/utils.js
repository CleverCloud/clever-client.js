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
 * @return {string|null}
 */
export function normalizeDate(date) {
  if (date == null) {
    return null;
  }
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'string' || typeof date === 'number') {
    return new Date(date).toISOString();
  }

  throw new Error(`Invalid date: ${date}`);
}

/**
 * Create a safe URL where every value is automatically encoded with the `encodeURIComponent()` function.
 *
 * Note that only string values are encoded. Other types are just converted to string.
 *
 * @param {TemplateStringsArray} strings
 * @param {Array<?>} values
 * @return {string}
 */
export function safeUrl(strings, ...values) {
  let result = '';

  strings.forEach((string, index) => {
    result += string + encode(values[index]);
  });

  return result;
}

/**
 * @param {?|null} value
 * @return {string}
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
