import { events } from 'fetch-event-stream';
import type { CcRequest, CcResponse, RequestAdapter, RequestWrapper, SseMessage } from '../../types/request.types.js';
import { CcClientError, CcRequestError } from '../error/cc-client-errors.js';
import { fetchWithTimeout } from './fetch-with-timeout.js';
import { requestDebug } from './request-debug.js';
import { requestWithCache } from './request-with-cache.js';
import { requestWithDedupe } from './request-with-dedupe.js';

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

const REQUEST_WRAPPERS: Array<RequestWrapper> = [requestWithCache, requestWithDedupe, requestDebug];

export async function sendRequest<CommandOutput>(request: CcRequest): Promise<CcResponse<CommandOutput>> {
  let i = 0;
  const handler: RequestAdapter = (request) => {
    i++;
    if (i >= REQUEST_WRAPPERS.length) {
      return doRequest(request);
    } else {
      return REQUEST_WRAPPERS[i](request, handler);
    }
  };

  return REQUEST_WRAPPERS[0]<CommandOutput>(request, handler);
}

async function doRequest<CommandOutput>(request: CcRequest): Promise<CcResponse<CommandOutput>> {
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
      body: (await getResponseBody(request, fetchResponse)) as CommandOutput,
      requestDuration: duration,
      cacheHit: false,
    };
  } catch (error: unknown) {
    if (error instanceof CcRequestError) {
      throw error;
    }

    if (error === 'TIMEOUT') {
      throw new CcClientError(`Timeout of ${request.timeout} ms exceeded`, 'TIMEOUT_EXCEEDED', request);
    }

    if (request.signal?.aborted) {
      throw new CcRequestError('The request was aborted', 'ABORTED', request, error);
    }

    if (isNetworkError(error as Parameters<typeof isNetworkError>[0])) {
      throw new CcRequestError(
        'A network error occurred while fetching HTTP endpoint',
        'NETWORK_ERROR',
        request,
        (error as { cause?: unknown }).cause ?? error,
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

export function getRequestUrl(request: CcRequest): URL {
  let url: URL;
  try {
    url = new URL(request.url, globalThis.location?.href);
  } catch (e) {
    throw new CcRequestError(`Invalid URL: "${request.url}"`, 'INVALID_URL', request, e);
  }

  request.queryParams?.applyOnUrl(url);

  return url;
}

export function getRequestBody(request: CcRequest): BodyInit | null {
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

  // eslint-disable-next-line @typescript-eslint/no-base-to-string -- non-JSON bodies are expected to be strings; an object here is a caller error left as-is (see todo above)
  return String(request.body);
}

async function getResponseBody(request: CcRequest, fetchResponse: Response): Promise<unknown> {
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

function getContentType(headers: Headers): string | null {
  const contentType = headers.get('content-type');
  return contentType != null ? contentType.split(';')[0] : contentType;
}

export function isNetworkError(error: {
  name: string;
  message: string;
  cause?: { code?: string };
  code?: string;
}): boolean {
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
  #response: Response;
  #signal: AbortSignal;

  constructor(response: Response, signal: AbortSignal) {
    this.#response = response;
    this.#signal = signal;
  }

  async read({
    onMessage,
    onError,
    onClose,
  }: {
    onMessage: (message: SseMessage) => void;
    onError?: (err: unknown) => void;
    onClose?: (reason?: unknown) => void;
  }): Promise<void> {
    try {
      const stream = events(this.#response, this.#signal);
      for await (const event of stream) {
        onMessage({
          data: event.data,
          event: event.event,
          id: event.id != null ? String(event.id) : null,
          retry: event.retry,
        });
      }
      onClose?.();
    } catch (err: unknown) {
      if (this.#signal.aborted) {
        onClose?.(this.#signal.reason);
      } else {
        // if we haven't aborted the request ourselves
        onError?.(err);
      }
    }
  }
}
