// This code is adapted from https://github.com/Azure/fetch-event-source
// MIT License Copyright (c) Microsoft Corporation.

import { readBytes } from '../../src/lib/stream/sse-parse.js';

/**
 * @typedef {import('./streams.types.js').SseMessage} SseMessage
 * @typedef {import('./streams.types.js').SseFetchEventSourceParams} SseFetchEventSourceParams
 */

export const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream';
export const JSON_CONTENT_TYPE = 'application/json';
const LAST_EVENT_ID_HEADER = 'Last-Event-ID';

/**
 * Native implementation of an SSE
 *
 * @param {string} input
 * @param {SseFetchEventSourceParams} params
 */
export function fetchEventSource(
  input,
  { abortController = new AbortController(), headers, onOpen, onMessage, onClose, onError, resumeFrom, ...rest },
) {
  // make a copy of the input headers since we may modify it below:
  /** @type {Record<string, string>} */
  const _headers = {
    accept: EVENT_STREAM_CONTENT_TYPE,
    ...headers,
  };
  if (resumeFrom != null) {
    _headers[LAST_EVENT_ID_HEADER] = resumeFrom;
  }

  fetch(input, {
    ...rest,
    headers: _headers,
    signal: abortController.signal,
  })
    .then(async (response) => {
      await onOpen(response);
      await readBytes(response.body, abortController.signal, onMessage);
      return onClose?.();
    })
    .catch((err) => {
      if (abortController.signal.aborted) {
        onClose?.(abortController.signal.reason);
      } else {
        // if we haven't aborted the request ourselves:
        onError?.(err);
      }
    });
}
