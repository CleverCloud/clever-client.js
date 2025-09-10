/**
 * @import { CcRequestParams } from '../../types/request.types.js'
 * @import { QueryParams } from './query-params.js'
 */
import { HeadersBuilder } from './headers-builder.js';

/**
 * @param {string} url
 * @param {QueryParams} [queryParams]
 * @returns {Partial<CcRequestParams>}
 */
export function get(url, queryParams) {
  return {
    method: 'GET',
    url,
    queryParams,
    headers: new HeadersBuilder().acceptJson().build(),
  };
}

/**
 * @param {string} url
 * @param {any} [body]
 * @param {QueryParams} [queryParams]
 * @returns {Partial<CcRequestParams>}
 */
export function post(url, body, queryParams) {
  return {
    method: 'POST',
    url,
    queryParams,
    headers: buildHeadersFromBody(body),
    body,
  };
}

/**
 * @param {string} url
 * @param {any} [body]
 * @param {QueryParams} [queryParams]
 * @returns {Partial<CcRequestParams>}
 */
export function postJson(url, body, queryParams) {
  return {
    method: 'POST',
    url,
    queryParams,
    headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
    body,
  };
}

/**
 * @param {string} url
 * @param {any} [body]
 * @param {QueryParams} [queryParams]
 * @returns {Partial<CcRequestParams>}
 */
export function put(url, body, queryParams) {
  return {
    method: 'PUT',
    url,
    queryParams,
    headers: buildHeadersFromBody(body),
    body,
  };
}

/**
 * @param {string} url
 * @param {any} [body]
 * @param {QueryParams} [queryParams]
 * @returns {Partial<CcRequestParams>}
 */
export function putJson(url, body, queryParams) {
  return {
    method: 'PUT',
    url,
    queryParams,
    headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
    body,
  };
}

/**
 * @param {string} url
 * @param {any} [body]
 * @param {QueryParams} [queryParams]
 * @returns {Partial<CcRequestParams>}
 */
export function patch(url, body, queryParams) {
  return {
    method: 'PATCH',
    url,
    queryParams,
    headers: buildHeadersFromBody(body),
    body,
  };
}

/**
 * @param {string} url
 * @param {any} [body]
 * @param {QueryParams} [queryParams]
 * @returns {Partial<CcRequestParams>}
 */
export function patchJson(url, body, queryParams) {
  return {
    method: 'PATCH',
    url,
    queryParams,
    headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
    body,
  };
}

/**
 * @param {string} url
 * @param {QueryParams} [queryParams]
 * @returns {Partial<CcRequestParams>}
 */
export function head(url, queryParams) {
  return {
    method: 'HEAD',
    url,
    queryParams,
  };
}

/**
 * @param {string} url
 * @param {QueryParams} [queryParams]
 * @returns {Partial<CcRequestParams>}
 */
export function delete_(url, queryParams) {
  return {
    method: 'DELETE',
    url,
    queryParams,
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
