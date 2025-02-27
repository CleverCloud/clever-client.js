import { fetchWithTimeout } from './request.fetch-with-timeout.js';
import { fillUrlSearchParams } from './utils/query-params.js';

/**
 * @typedef {import('./request.types.js').RequestParams} RequestParams
 * @typedef {import('./request.types.js').RequestError} RequestError
 */

const JSON_TYPE = 'application/json';
const FORM_TYPE = 'application/x-www-form-urlencoded';

/**
 * @param {RequestParams} requestParams
 * @returns {*|string}
 * @throws {RequestError}
 */
function formatBody (requestParams) {

  // for now we support the fact that users sometimes already stringified the body
  if (requestParams.headers['Content-Type'] === JSON_TYPE && typeof requestParams.body !== 'string') {
    return JSON.stringify(requestParams.body);
  }

  // for now we support the fact that users sometimes already stringified the body
  if (requestParams.headers['Content-Type'] === FORM_TYPE && typeof requestParams.body !== 'string') {
    const qs = new URLSearchParams();
    Object
      .entries(requestParams.body)
      .forEach(([name, value]) => qs.set(name, value));
    return qs.toString();
  }

  return requestParams.body;
}

/**
 * @param {Headers} headers
 * @returns {string}
 */
function getContentType (headers) {
  const contentType = headers.get('Content-Type');
  return (contentType != null)
    ? contentType.split(';')[0]
    : contentType;
}

/**
 * @param {Response} response
 * @returns {Promise<any>}
 */
async function parseResponseBody (response) {
  const contentType = getContentType(response.headers);

  if (contentType === JSON_TYPE) {
    return response.json();
  }

  if (contentType === FORM_TYPE) {
    const text = await response.text();
    /** @type {Record<string, string>} */
    const responseObject = {};
    Array
      .from(new URLSearchParams(text).entries())
      .forEach(([name, value]) => (responseObject[name] = value));
    return responseObject;
  }

  return response.text();
}

/**
 *
 * @param {null|string|{message?: string, error?: string}} responseBody
 * @returns {string}
 */
function getErrorMessage (responseBody) {
  if (typeof responseBody === 'string') {
    return responseBody;
  }
  if (typeof responseBody?.message === 'string') {
    return responseBody.message;
  }
  if (typeof responseBody?.error === 'string') {
    return responseBody.error;
  }

  return 'Unknown error';
}

/**
 * @param {RequestParams} requestParams
 * @returns {Promise<T>}
 * @throws {RequestError}
 * @template T
 */
export async function request (requestParams) {

  const url = new URL(requestParams.url);
  fillUrlSearchParams(url, requestParams.queryParams);

  const body = formatBody(requestParams);

  const response = await fetchWithTimeout(url.toString(), { ...requestParams, body, mode: 'cors' }, requestParams.timeout);

  if (response.status >= 400) {
    const responseBody = await parseResponseBody(response);
    const errorMessage = getErrorMessage(responseBody);
    const error = /** @type {RequestError} */ (new Error(errorMessage));
    // NOTE: This is only for legacy
    if (responseBody.id != null) {
      error.id = responseBody.id;
    }
    error.response = response;
    error.responseBody = responseBody;
    throw error;
  }

  if (response.status === 204) {
    return undefined;
  }

  return parseResponseBody(response);
}
