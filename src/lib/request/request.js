import { CcRequestError } from '../error/cc-client-errors.js';
import { requestDebug } from './request-debug.js';
import { requestTimeout } from './request-timeout.js';
import { requestWithCache } from './request-with-cache.js';

/**
 * @typedef {import('../../types/request.types.js').CcRequest} CcRequest
 * @typedef {import('../../types/request.types.js').RequestAdapter} RequestAdapter
 * @typedef {import('../../types/request.types.js').RequestWrapper} RequestWrapper
 */

const JSON_TYPE = 'application/json';
const FORM_TYPE = 'application/x-www-form-urlencoded';

/** @type {Array<RequestWrapper>} */
const REQUEST_WRAPPERS = [requestWithCache, requestTimeout, requestDebug];

/**
 * @type {RequestAdapter}
 */
export async function sendRequest(request) {
  let i = 0;
  /** @type {RequestAdapter} */
  const handler = (request) => {
    i++;
    if (i >= REQUEST_WRAPPERS.length) {
      return doRequest(request);
    } else {
      return REQUEST_WRAPPERS[i](request, handler);
    }
  };

  return REQUEST_WRAPPERS[0](request, handler);
}

/**
 * @type {RequestAdapter}
 */
async function doRequest(request) {
  try {
    const url = getRequestUrl(request);
    const body = getRequestBody(request);

    const fetchResponse = await fetch(url, {
      method: request.method,
      headers: request.headers,
      body,
      mode: request.cors ? 'cors' : undefined,
      signal: request.signal,
    });

    return {
      status: fetchResponse.status,
      headers: fetchResponse.headers,
      body: await getResponseBody(fetchResponse),
      request,
    };
  } catch (err) {
    /** @param {Error|any} err */
    if (err instanceof CcRequestError) {
      throw err;
    }

    if (err instanceof TypeError && /fetch/i.test(err.message)) {
      throw new CcRequestError(
        'A network error occurred while fetching HTTP endpoint',
        'NETWORK_ERROR',
        request,
        err.cause ?? err,
      );
    }

    throw new CcRequestError('An unknown error occurred while fetching HTTP endpoint', 'UNKNOWN_ERROR', request, err);
  }
}

/**
 * @param {CcRequest} request
 * @returns {URL}
 * @throws {CcClientError}
 */
function getRequestUrl(request) {
  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    throw new CcRequestError(`Invalid URL: "${request.url}"`, 'INVALID_URL', request, e);
  }

  request.queryParams?.applyOnUrl(url);

  return url;
}

/**
 * @param {CcRequest} request
 * @returns {BodyInit|null}
 */
function getRequestBody(request) {
  if (request.body == null) {
    return null;
  }

  const contentType = getContentType(request.headers);

  if (contentType === JSON_TYPE && typeof request.body !== 'string') {
    return JSON.stringify(request.body);
  }

  if (contentType === FORM_TYPE && typeof request.body !== 'string') {
    const formData = new URLSearchParams();
    Object.entries(request.body).forEach(([name, value]) => formData.append(name, value));
    return formData;
  }

  // todo: if text/plain but got object => error?
  // todo: streamable request body?

  return String(request.body);
}

/**
 * @param {Response} fetchResponse
 * @returns {Promise<any>}
 */
async function getResponseBody(fetchResponse) {
  if (fetchResponse.status === 204) {
    return null;
  }

  const responseContentType = getContentType(fetchResponse.headers);
  if (responseContentType === JSON_TYPE) {
    return fetchResponse.json();
  }

  if (responseContentType === FORM_TYPE) {
    const text = await fetchResponse.text();
    /** @type {Record<string, string>} */
    const responseObject = {};
    Array.from(new URLSearchParams(text).entries()).forEach(([name, value]) => (responseObject[name] = value));

    return responseObject;
  }

  // todo. streamable response

  return fetchResponse.text();
}

/**
 * @param {Headers} headers
 * @returns {string|null}
 */
function getContentType(headers) {
  const contentType = headers.get('Content-Type');
  return contentType != null ? contentType.split(';')[0] : contentType;
}
