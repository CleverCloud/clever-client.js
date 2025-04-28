/**
 * @import { OneOrMany, MockRequest } from './mock-api.types.js';
 */

/**
 * @param {MockRequest} request
 * @returns {string}
 */
export function createRequestKey(request) {
  return [request.method.toLowerCase(), normalizePath(request.path).pathname].join('-');
}

/**
 * @param {string} path
 * @returns {{pathname: string, queryParams: Record<string, OneOrMany<string>>}}
 */
export function normalizePath(path) {
  const p = path.startsWith('/') ? path.substring(1) : path;
  const url = new URL('http://h/' + p);
  return {
    pathname: url.pathname,
    queryParams: decodeQueryParams(url),
  };
}

/**
 * @param {URL} url
 * @returns {Record<string, OneOrMany<string>>}
 */
export function decodeQueryParams(url) {
  /** @type {Record<string, OneOrMany<string>>} */
  const result = {};
  Array.from(url.searchParams.entries()).forEach(([k, v]) => {
    if (Object.hasOwn(result, k)) {
      if (Array.isArray(result[k])) {
        result[k] = [...result[k], v];
      } else {
        result[k] = [result[k], v];
      }
    } else {
      result[k] = v;
    }
  });

  return result;
}
