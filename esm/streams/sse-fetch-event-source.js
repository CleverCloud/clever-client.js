// This code is adapted from https://github.com/Azure/fetch-event-source
// MIT License Copyright (c) Microsoft Corporation.

import { getBytes, getLines, getMessages } from './sse-parse.js';

export const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream';
export const JSON_CONTENT_TYPE = 'application/json';
const DEFAULT_RETRY_INTERVAL = 1000;
const LAST_EVENT_ID_HEADER = 'last-event-id';

/**
 * Native implementation of an SSE
 * Handle retry on: wire protocol, bad ContentType
 * @param {string} input
 * @param {object} param1
 * @returns
 */
export function fetchEventSource (input, {
  abortController = new AbortController(),
  headers,
  onOpen,
  onMessage,
  onClose,
  onError,
  retryInterval = DEFAULT_RETRY_INTERVAL,
  resumeFrom,
  ...rest
}) {
  return new Promise((resolve) => {
    // make a copy of the input headers since we may modify it below:
    let _headers = {
      accept: EVENT_STREAM_CONTENT_TYPE, ...headers,
    };
    if (resumeFrom) {
      _headers['Last-Event-ID'] = resumeFrom;
    }

    let retryTimeoutId = 0;

    function dispose () {
      clearTimeout(retryTimeoutId);
    }

    // if the incoming signal aborts, dispose resources and resolve:
    abortController.signal?.addEventListener('abort', () => {
      dispose();
      // don't waste time constructing/logging errors
      resolve();
    });

    async function create () {
      try {
        const response = await fetch(input, {
          ...rest,
          headers: _headers,
          signal: abortController.signal,
        });

        await onOpen(response);

        const online = getMessages(onMessage,
          (id) => {
            if (id) {
              // store the id and send it back on the next retry:
              headers[LAST_EVENT_ID_HEADER] = id;
            }
            else {
              // don't send the last-event-id header anymore:
              delete headers[LAST_EVENT_ID_HEADER];
            }
          },
          (retry) => {
            retryInterval = retry;
          },
        );

        await getBytes(response.body, getLines(online));

        onClose?.();
        dispose();
        resolve();
      }
      catch (err) {
        if (abortController.signal.aborted) {
          onClose(abortController.signal.reason);
          return;
        }

        // if we haven't aborted the request ourselves:
        onError?.(err);

        clearTimeout(retryTimeoutId);
        retryTimeoutId = setTimeout(create, retryInterval);
      }
    }

    create();
  });
}
