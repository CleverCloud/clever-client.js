import { fetchWithTimeout } from './request.fetch-with-timeout.js';

export async function execWarpscript (requestParams) {

  const url = new URL(requestParams.url);
  Object
    .entries(requestParams.queryParams || {})
    .forEach(([k, v]) => url.searchParams.set(k, v));

  return fetchWithTimeout(url.toString(), { ...requestParams, mode: 'cors' }, requestParams.timeout)
    .then((response) => {
      if (response.status !== 200) {
        const warp10error = 'Warp10 Error: ' + response.headers.get('X-Warp10-Error-Message');
        throw new Error(warp10error);
      }
      return response.json();
    })
    .then((parsedResponse) => {
      return (requestParams.responseHandler != null)
        ? requestParams.responseHandler(parsedResponse)
        : parsedResponse;
    });
}
