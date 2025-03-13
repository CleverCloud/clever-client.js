import { fetchWithTimeout } from './request.fetch-with-timeout.js';
import { fillUrlSearchParams } from './utils/query-params.js';

/**
 * @typedef {import('./request-warp10.types.js').Warp10RequestParams} Warp10RequestParams
 */

/**
 * @param {Warp10RequestParams} requestParams
 * @returns {Promise<Response>}
 */
export async function execWarpscript(requestParams) {
  const url = new URL(requestParams.url);
  fillUrlSearchParams(url, requestParams.queryParams);

  return fetchWithTimeout(url.toString(), { ...requestParams, mode: 'cors' }, requestParams.timeout)
    .then((response) => {
      if (response.status !== 200) {
        const warp10error = 'Warp10 Error: ' + response.headers.get('X-Warp10-Error-Message');
        throw new Error(warp10error);
      }
      return response.json();
    })
    .then((parsedResponse) => {
      return requestParams.responseHandler != null ? requestParams.responseHandler(parsedResponse) : parsedResponse;
    });
}
