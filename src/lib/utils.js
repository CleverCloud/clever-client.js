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
