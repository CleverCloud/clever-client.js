import { CleverClientError } from '../errors/clever-client-errors.js';

/**
 * @typedef {import('./request.types.js').RequestParams} RequestParams
 * @typedef {import('./request.types.js').RequestAdapter} RequestAdapter
 */

const JSON_TYPE = 'application/json';
const FORM_TYPE = 'application/x-www-form-urlencoded';

/**
 * @type {RequestAdapter}
 */
export async function requestAdapterFetch (requestParams) {
  try {
    const url = getRequestUrl(requestParams);
    const body = getRequestBody(requestParams);

    const fetchResponse = await fetch(url, {
      method: requestParams.method,
      headers: requestParams.headers,
      body,
      mode: requestParams.cors ? 'cors' : undefined,
      signal: requestParams.signal,
    });

    return {
      status: fetchResponse.status,
      headers: fetchResponse.headers,
      body: await getResponseBody(fetchResponse),
      requestParams,
    };
  }
  /** @param {Error|any} err */
  catch (err) {
    if (err instanceof CleverClientError) {
      throw err;
    }

    if (err instanceof TypeError && /fetch/i.test(err.message)) {
      throw new CleverClientError('A network error occurred while fetching HTTP endpoint', 'NETWORK_ERROR', requestParams, err.cause ?? err);
    }

    throw new CleverClientError('An unknown error occurred while fetching HTTP endpoint', 'UNKNOWN_ERROR', requestParams, err);
  }
}

/**
 * @param {Partial<RequestParams>} requestParams
 * @returns {URL}
 * @throws {CleverClientError}
 */
function getRequestUrl (requestParams) {
  let url;
  try {
    url = new URL(requestParams.url);
  }
  catch (e) {
    throw new CleverClientError(`Invalid URL: "${requestParams.url}"`, 'INVALID_URL', requestParams, e);
  }

  requestParams.queryParams?.applyOnUrl(url);

  return url;
}

/**
 * @param {Partial<RequestParams>} requestParams
 * @returns {BodyInit|null}
 */
function getRequestBody (requestParams) {
  if (requestParams.body == null) {
    return null;
  }

  const contentType = getContentType(requestParams.headers);

  if (contentType === JSON_TYPE && typeof requestParams.body !== 'string') {
    return JSON.stringify(requestParams.body);
  }

  if (contentType === FORM_TYPE && typeof requestParams.body !== 'string') {
    const formData = new URLSearchParams();
    Object.entries(requestParams.body).forEach(([name, value]) =>
      formData.append(name, value),
    );
    return formData;
  }

  // todo: if text/plain but got object => error?
  // todo: streamable request body?

  return String(requestParams.body);
}

/**
 * @param {Response} fetchResponse
 * @return {Promise<any>}
 */
async function getResponseBody (fetchResponse) {
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
    Array.from(new URLSearchParams(text).entries()).forEach(
      ([name, value]) => (responseObject[name] = value),
    );

    return responseObject;
  }

  // todo. streamable response

  return fetchResponse.text();
}

/**
 * @param {Headers} headers
 * @returns {string|null}
 */
function getContentType (headers) {
  const contentType = headers.get('Content-Type');
  return contentType != null ? contentType.split(';')[0] : contentType;
}
