/**
 * @typedef {import('./query-params.types.js').QueryParams} QueryParams
 */

/**
 * @param {URL} url
 * @param {import('./query-params.types.js').QueryParams<T>} queryParams
 * @param {(param: T) => string} [formatValue]
 * @template T
 */
export function fillUrlSearchParams (url, queryParams, formatValue) {
  Object
    .entries(queryParams || {})
    .forEach(([k, v]) => {
      const values = Array.isArray(v) ? v : [v];
      values
        .filter((value) => value != null)
        .forEach((value) => {
          url.searchParams.append(k, formatValue ? formatValue(value) : String(value));
        });
    });
}

/**
 * @param {URL} url
 * @returns {QueryParams}
 */
export function extractQueryParamsFormUrl (url) {
  /** @type {QueryParams} */
  const queryParams = {};
  Array.from(url.searchParams.entries()).forEach(([k, v]) => {
    if (Object.hasOwn(queryParams, k)) {
      if (Array.isArray(queryParams[k])) {
        queryParams[k] = [...queryParams[k], v];
      }
      else {
        queryParams[k] = [queryParams[k], v];
      }
    }
    else {
      queryParams[k] = v;
    }
  });

  return queryParams;
}
