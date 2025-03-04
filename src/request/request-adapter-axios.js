import { CleverClientError } from '../errors/clever-client-errors.js';
import axios, { AxiosHeaders } from 'axios';

/**
 * @typedef {import('./request.types.js').RequestParams} RequestParams
 * @typedef {import('./request.types.js').RequestAdapter} RequestAdapter
 */

/**
 * @type {RequestAdapter}
 */
export async function requestAdapterAxios (requestParams) {
  try {
    const url = getRequestUrl(requestParams);

    const axiosHeader = new AxiosHeaders();
    if (requestParams.headers != null) {
      requestParams.headers.forEach((value, key) => {
        axiosHeader.set(key, value);
      });
    }

    // Send a POST request
    const axiosResponse = await axios({
      method: requestParams.method,
      url: url.toString(),
      data: requestParams.body,
      headers: axiosHeader,
      signal: requestParams.signal,
    });

    const responseHeaders = new Headers();
    if (axiosResponse.headers != null) {
      responseHeaders.forEach((value, key) => {
        responseHeaders.set(key, value);
      });
    }

    return {
      status: axiosResponse.status,
      headers: responseHeaders,
      body: axiosResponse.data,
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
