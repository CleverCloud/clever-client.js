import { fetchWithTimeout } from './request.fetch-with-timeout.js';
import { fillUrlSearchParams } from './utils/query-params.js';

import type { RequestError, RequestParams } from './request.types.js';

const JSON_TYPE = 'application/json';
const FORM_TYPE = 'application/x-www-form-urlencoded';

function formatBody(requestParams: RequestParams): any {
  // for now we support the fact that users sometimes already stringified the body
  if (requestParams.headers['Content-Type'] === JSON_TYPE && typeof requestParams.body !== 'string') {
    return JSON.stringify(requestParams.body);
  }

  // for now we support the fact that users sometimes already stringified the body
  if (requestParams.headers['Content-Type'] === FORM_TYPE && typeof requestParams.body !== 'string') {
    const qs = new URLSearchParams();
    Object.entries(requestParams.body).forEach(([name, value]) => qs.set(name, value));
    return qs.toString();
  }

  return requestParams.body;
}

function getContentType(headers: Headers): string {
  const contentType = headers.get('Content-Type');
  return contentType != null ? contentType.split(';')[0] : contentType;
}

async function parseResponseBody(response: Response): Promise<any> {
  const contentType = getContentType(response.headers);

  if (contentType === JSON_TYPE) {
    return response.json();
  }

  if (contentType === FORM_TYPE) {
    const text = await response.text();
    const responseObject: Record<string, string> = {};
    Array.from(new URLSearchParams(text).entries()).forEach(([name, value]) => (responseObject[name] = value));
    return responseObject;
  }

  return response.text();
}

function getErrorMessage(responseBody: null | string | { message?: string; error?: string }): string {
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

export async function request<T>(requestParams: RequestParams): Promise<T> {
  const url = new URL(requestParams.url);
  fillUrlSearchParams(url, requestParams.queryParams);

  const body = formatBody(requestParams);

  const response = await fetchWithTimeout(
    url.toString(),
    { ...requestParams, body, mode: 'cors' },
    requestParams.timeout,
  );

  if (response.status >= 400) {
    const responseBody = await parseResponseBody(response);
    const errorMessage = getErrorMessage(responseBody);
    const error = new Error(errorMessage) as RequestError;
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
