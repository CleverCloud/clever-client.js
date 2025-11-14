/**
 * @import { CcRequest, RequestAdapter, RequestWrapper, SseMessage } from '../../types/request.types.js'
 */
import { events } from 'fetch-event-stream';
import { CcClientError, CcRequestError } from '../error/cc-client-errors.js';
import { fetchWithTimeout } from './fetch-with-timeout.js';
import { requestDebug } from './request-debug.js';
import { requestWithCache } from './request-with-cache.js';

const JSON_TYPE = 'application/json';
const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream';
const NETWORK_ERROR_CODES = [
  'EAI_AGAIN',
  'ENOTFOUND',
  'ECONNREFUSED',
  'ECONNRESET',
  'EPIPE',
  'ETIMEDOUT',
  'UND_ERR_SOCKET',
];

/** @type {Array<RequestWrapper>} */
const REQUEST_WRAPPERS = [requestWithCache, requestDebug];

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

    const now = new Date().getTime();
    const fetchResponse = await fetchWithTimeout(request.timeout, url, {
      method: request.method,
      headers: request.headers,
      body,
      mode: request.cors ? 'cors' : 'same-origin',
      signal: request.signal,
    });
    const duration = new Date().getTime() - now;

    return {
      status: fetchResponse.status,
      headers: fetchResponse.headers,
      body: await getResponseBody(request, fetchResponse),
      requestDuration: duration,
      cacheHit: false,
    };
  } catch (error) {
    /** @param {Error|any} err */
    if (error instanceof CcRequestError) {
      throw error;
    }

    if (error === 'TIMEOUT') {
      throw new CcClientError(`Timeout of ${request.timeout} ms exceeded`, 'TIMEOUT_EXCEEDED', request);
    }

    if (request.signal?.aborted) {
      throw new CcRequestError('The request was aborted', 'ABORTED', request, error);
    }

    if (isNetworkError(error)) {
      throw new CcRequestError(
        'A network error occurred while fetching HTTP endpoint',
        'NETWORK_ERROR',
        request,
        error.cause ?? error,
      );
    }

    throw new CcRequestError(
      'An unexpected error occurred while fetching HTTP endpoint',
      'UNEXPECTED_ERROR',
      request,
      error,
    );
  }
}

/**
 * @param {CcRequest} request
 * @returns {URL}
 * @throws {CcClientError}
 */
export function getRequestUrl(request) {
  let url;
  try {
    url = new URL(request.url, globalThis.location?.href);
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
export function getRequestBody(request) {
  if (request.body == null) {
    return null;
  }

  if (request.body instanceof Blob) {
    return request.body;
  }

  const contentType = getContentType(request.headers);

  if (contentType === JSON_TYPE) {
    return JSON.stringify(request.body);
  }

  // todo: if text/plain but got object => error?
  // todo: streamable request body?

  return String(request.body);
}

/**
 * @param {CcRequest} request
 * @param {Response} fetchResponse
 * @returns {Promise<any>}
 */
async function getResponseBody(request, fetchResponse) {
  if (request.method === 'HEAD') {
    return null;
  }

  if (fetchResponse.status === 204) {
    return null;
  }

  if (fetchResponse.headers.get('content-length') === '0') {
    return null;
  }

  const responseContentType = getContentType(fetchResponse.headers);
  if (responseContentType === JSON_TYPE) {
    return fetchResponse.json();
  }

  if (responseContentType === EVENT_STREAM_CONTENT_TYPE) {
    return new SseResponseBody(fetchResponse, request.signal);
  }

  if (responseContentType?.startsWith('text/')) {
    return fetchResponse.text();
  }

  // todo. streamable response

  return fetchResponse.blob();
}

/**
 * @param {Headers} headers
 * @returns {string|null}
 */
function getContentType(headers) {
  const contentType = headers.get('content-type');
  return contentType != null ? contentType.split(';')[0] : contentType;
}

/**
 * @param {{name: string, message: string, cause?: {code?: string}, code?: string}} error
 * @returns {boolean}
 */
export function isNetworkError(error) {
  const errorCode = error.cause?.code ?? error.code;

  if (NETWORK_ERROR_CODES.includes(errorCode)) {
    return true;
  }

  if (error.name === 'TypeError') {
    if (error.message === 'Failed to fetch') {
      return true;
    }
    if (error.message === 'network error') {
      return true;
    }
    if (error.message.startsWith('NetworkError')) {
      return true;
    }
  }

  return false;
}

export class SseResponseBody {
  /** @type {Response} */
  #response;
  /** @type {AbortSignal} */
  #signal;

  /**
   * @param {Response} response
   * @param {AbortSignal} signal
   */
  constructor(response, signal) {
    this.#response = response;
    this.#signal = signal;
  }

  /**
   *
   * @param {Object} _
   * @param {(message: SseMessage) => void} _.onMessage
   * @param {(err: any) => void} [_.onError]
   * @param {(reason: any) => void} [_.onClose]
   * @return {Promise<*>}
   */
  async read({ onMessage, onError, onClose }) {
    try {
      const stream = events(this.#response, this.#signal);
      for await (let event of stream) {
        onMessage({
          data: event.data,
          event: event.event,
          id: event.id != null ? String(event.id) : null,
          retry: event.retry,
        });
      }
      return onClose?.();
    } catch (err) {
      if (this.#signal.aborted) {
        onClose?.(this.#signal.reason);
      } else {
        // if we haven't aborted the request ourselves
        onError?.(err);
      }
    }
  }
}
