/**
 * @param {T} src
 * @param {Array<keyof T>} keyNames
 * @returns {Partial<T>}
 * @template {object} T
 */
export function pickNonNull(src, keyNames) {
  /** @type {Partial<T>} */
  const result = {};

  if (src != null) {
    const keys = /** @type {Array<keyof T>} */ (Object.keys(src));
    keys.forEach((key) => {
      const value = src[key];
      if (value != null && keyNames.includes(key)) {
        result[key] = value;
      }
    });
  }

  return result;
}
