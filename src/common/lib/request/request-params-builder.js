import { HeadersBuilder } from './headers-builder.js';

/**
 * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @param {string} url
 * @returns {Partial<CcRequestParams>}
 */
export function get(url) {
  return {
    method: 'GET',
    url,
    headers: new HeadersBuilder().acceptJson().build(),
  };
}

/**
 * @param {string} url
 * @param {any} [body]
 * @returns {Partial<CcRequestParams>}
 */
export function post(url, body) {
  return {
    method: 'POST',
    url,
    headers: buildHeadersFromBody(body),
    body,
  };
}

/**
 * @param {string} url
 * @param {any} [body]
 * @returns {Partial<CcRequestParams>}
 */
export function put(url, body) {
  return {
    method: 'PUT',
    url,
    headers: buildHeadersFromBody(body),
    body,
  };
}

/**
 * @param {string} url
 * @param {any} [body]
 * @returns {Partial<CcRequestParams>}
 */
export function patch(url, body) {
  return {
    method: 'PATCH',
    url,
    headers: buildHeadersFromBody(body),
    body,
  };
}

/**
 * @param {string} url
 * @returns {Partial<CcRequestParams>}
 */
export function head(url) {
  return {
    method: 'HEAD',
    url,
  };
}

/**
 * @param {string} url
 * @returns {Partial<CcRequestParams>}
 */
export function delete_(url) {
  return {
    method: 'DELETE',
    url,
    headers: new HeadersBuilder().acceptJson().build(),
  };
}

/**
 * @param {any|null} body
 * @returns {Headers}
 */
function buildHeadersFromBody(body) {
  const builder = new HeadersBuilder().acceptJson();

  if (typeof body === 'string') {
    builder.contentTypeTextPlain();
  } else if (body != null) {
    builder.contentTypeJson();
  }

  return builder.build();
}
