/**
 * @param {T} obj
 * @param {Array<K>} keys
 * @returns {Omit<T, K>}
 * @template {object} T
 * @template {keyof T} K
 */
export function omit(obj, ...keys) {
  keys.forEach((key) => delete obj[key]);
  return obj;
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
export function normalizeOutputDate(date) {
  if (date == null) {
    return null;
  }
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'string') {
    return date;
  }
  if (typeof date === 'number') {
    return new Date(date).toISOString();
  }

  throw new Error(`Invalid date: ${date}`);
}

/**
 * @param {Date|string|number} date
 * @return {string|null}
 */
export function normalizeInputDate(date) {
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
