import { fetchWithTimeout } from './request.fetch-with-timeout.js';

const JSON_TYPE = 'application/json';
const FORM_TYPE = 'application/x-www-form-urlencoded';

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

function getContentType (headers) {
  const contentType = headers.get('Content-Type');
  return (contentType != null)
    ? contentType.split(';')[0]
    : contentType;
}

function parseResponseBody (response) {

  const contentType = getContentType(response.headers);

  if (contentType === JSON_TYPE) {
    return response.json();
  }

  if (contentType === FORM_TYPE) {
    return response.text()
      .then((text) => {
        const responseObject = {};
        Array
          .from(new URLSearchParams(text).entries())
          .forEach(([name, value]) => (responseObject[name] = value));
        return responseObject;
        // TODO: return Object.fromEntries(new URLSearchParams(text).entries())
      });
  }

  return response.text();
}

export async function request (requestParams) {

  const url = new URL(requestParams.url);
  Object
    .entries(requestParams.queryParams || {})
    .forEach(([k, v]) => url.searchParams.set(k, v));

  const body = formatBody(requestParams);

  const response = await fetchWithTimeout(url.toString(), { ...requestParams, body, mode: 'cors' }, requestParams.timeout);

  if (response.status >= 400) {
    const responseBody = await parseResponseBody(response);
    const errorMessage = (responseBody.message != null)
      ? responseBody.message
      : responseBody;
    const error = new Error(errorMessage);
    // NOTE: This is only for legacy
    if (responseBody.id != null) {
      error.id = responseBody.id;
    }
    error.response = response;
    error.responseBody = responseBody;
    throw error;
  }

  if (response.status === 204) {
    return;
  }

  return parseResponseBody(response);
}
