import { events } from 'fetch-event-stream';
import type { CcRequest, CcResponse, RequestAdapter, RequestWrapper, SseMessage } from '../../types/request.types.js';
import { CcClientError, CcRequestError } from '../error/cc-client-errors.js';
import { asNetworkError } from '../error/network-error.js';
import { fetchWithTimeout } from './fetch-with-timeout.js';
import { requestDebug } from './request-debug.js';
import { requestWithCache } from './request-with-cache.js';
import { requestWithDedupe } from './request-with-dedupe.js';

const JSON_TYPE = 'application/json';
const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream';

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
      mode: request.isCorsEnabled ? 'cors' : 'same-origin',
      signal: request.signal,
    });
    const duration = new Date().getTime() - now;

    return {
      status: fetchResponse.status,
      headers: fetchResponse.headers,
      body: (await getResponseBody(request, fetchResponse)) as CommandOutput,
      requestDuration: duration,
      hasHitCache: false,
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

    const networkError = asNetworkError(error, request);
    if (networkError != null) {
      throw networkError;
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
    return getJsonResponseBody(fetchResponse);
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
 * The body of a response announced as JSON, tolerating a malformed one when it reports an error.
 *
 * A backend can announce JSON and send something that isn't: billing-api builds its error bodies by
 * interpolating the message straight into a JSON string, so a message holding a quote or a newline
 * goes out malformed. Letting the parse failure through would replace the error the caller needs —
 * status, code, message — with an opaque `UNEXPECTED_ERROR`, dropping the status with it, so the
 * response never becomes the `CcHttpError` it should be and `tolerateNotFound()` and friends stop
 * working on it. Falling back to the raw text keeps the status and reports whatever the body held.
 *
 * Only error responses get that tolerance. On a successful one the body *is* the result, and a
 * command handed a string where it expects its output would fail further away, on a worse message.
 */
async function getJsonResponseBody(fetchResponse: Response): Promise<unknown> {
  if (fetchResponse.status < 400) {
    return fetchResponse.json();
  }

  const text = await fetchResponse.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getContentType(headers: Headers | undefined): string | null {
  const contentType = headers?.get('content-type') ?? null;
  return contentType != null ? contentType.split(';')[0] : contentType;
}

export class SseResponseBody {
  #response: Response;
  #signal: AbortSignal | undefined;

  constructor(response: Response, signal: AbortSignal | undefined) {
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
          data: event.data ?? '',
          event: event.event ?? '',
          id: event.id != null ? String(event.id) : '',
          retry: event.retry,
        });
      }
      onClose?.();
    } catch (err: unknown) {
      if (this.#signal?.aborted) {
        onClose?.(this.#signal.reason);
      } else {
        // if we haven't aborted the request ourselves
        onError?.(err);
      }
    }
  }
}
