import { events } from 'fetch-event-stream';

import type { SseFetchEventSourceParams } from './streams.types.js';

export const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream';
export const JSON_CONTENT_TYPE = 'application/json';
const LAST_EVENT_ID_HEADER = 'Last-Event-ID';

/**
 * Native implementation of an SSE
 */
export function fetchEventSource(
  input: string,
  {
    abortController = new AbortController(),
    headers,
    onOpen,
    onMessage,
    onClose,
    onError,
    resumeFrom,
    ...rest
  }: SseFetchEventSourceParams,
) {
  // make a copy of the input headers since we may modify it below:
  const _headers: Record<string, string> = {
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
      const stream = events(response, abortController.signal);
      for await (const event of stream) {
        onMessage({
          data: event.data!,
          event: event.event!,
          id: event.id != null ? String(event.id) : '',
          retry: event.retry,
        });
      }
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
