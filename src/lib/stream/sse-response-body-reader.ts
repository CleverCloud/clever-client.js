import { events } from 'fetch-event-stream';
import type { SseMessage } from '../../types/request.types.js';
import type { SseResponseBody } from '../request/request.js';

/**
 * Reads the messages of an event stream response until it ends.
 *
 * It lives here rather than next to {@link SseResponseBody} so that `fetch-event-stream` is only
 * bundled with the streams: the request pipeline every command goes through never imports it.
 *
 * @param body - The unread body of the response
 * @param callbacks - Called with each message, when the response ends, and when reading it fails
 */
export async function readSseResponseBody(
  body: SseResponseBody,
  {
    onMessage,
    onError,
    onClose,
  }: {
    onMessage: (message: SseMessage) => void;
    onError?: (err: unknown) => void;
    onClose?: (reason?: unknown) => void;
  },
): Promise<void> {
  try {
    const stream = events(body.response, body.signal);
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
    if (body.signal?.aborted) {
      onClose?.(body.signal.reason);
    } else {
      // if we haven't aborted the request ourselves
      onError?.(err);
    }
  }
}
