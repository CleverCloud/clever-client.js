// This code is adapted from https://github.com/Azure/fetch-event-source
// MIT License Copyright (c) Microsoft Corporation.

/**
 * @typedef {import('./streams.types.js').SseMessage} SseMessage
 */

const CONTROL_CHARS = {
  NewLine: 10,
  CarriageReturn: 13,
  Space: 32,
  Colon: 58,
};

/**
 * Converts a ReadableStream into a callback pattern.
 *
 * @param {ReadableStream<any>} stream The input ReadableStream.
 * @param {AbortSignal} signal An AbortSignal instance (required for Node.js versions before 18.6)
 * @param {(message: SseMessage) => void} onMessage A function that will be called on each message.
 * @returns {Promise<void>} A promise that will be resolved when the stream closes.
 */
export async function readBytes(stream, signal, onMessage) {
  // Setup parsers
  const onLine = getMessages(onMessage);
  const onChunk = getLines(onLine);

  if ('getReader' in stream) {
    const reader = stream.getReader();

    // There's a bug in Node.js < 18.16.
    // Aborting a fetch request does not stop the response body stream from being read.
    signal.addEventListener(
      'abort',
      () => {
        reader
          .cancel(signal.reason)
          // Firefox doesn't like when we cancel a reader that is already closed but we can ignore this
          .catch(() => {});
      },
      { once: true },
    );

    let shouldContinue = true;
    while (shouldContinue) {
      const result = await reader.read();
      shouldContinue = !result.done;
      if (shouldContinue) {
        onChunk(result.value);
      }
    }
  }
}

/**
 * Parses arbitrary byte chunks into EventSource line buffers.
 * Each line should be of the format "field: value" and ends with \r, \n, or \r\n.
 * @param {(line: Uint8Array, fieldLength: number) => void} onLine A function that will be called on each new EventSource line.
 * @returns {(chunk: Uint8Array) => void} A function that should be called for each incoming byte chunk.
 */
export function getLines(onLine) {
  /** @type {Uint8Array} */
  let buffer;
  /** @type {number} current read position */
  let position;
  /** @type {number} length of the `field` portion of the line */
  let fieldLength;
  let discardTrailingNewline = false;

  // return a function that can process each incoming byte chunk:
  return function onChunk(arr) {
    if (buffer === undefined) {
      buffer = arr;
      position = 0;
      fieldLength = -1;
    } else {
      // we're still parsing the old line. Append the new bytes into buffer:
      buffer = concat(buffer, arr);
    }

    const bufLength = buffer.length;
    // index where the current line starts
    let lineStart = 0;
    while (position < bufLength) {
      if (discardTrailingNewline) {
        if (buffer[position] === CONTROL_CHARS.NewLine) {
          // skip to next char
          lineStart = ++position;
        }

        discardTrailingNewline = false;
      }

      // start looking forward till the end of line:
      // index of the \r or \n char
      let lineEnd = -1;
      for (; position < bufLength && lineEnd === -1; ++position) {
        switch (buffer[position]) {
          case CONTROL_CHARS.Colon:
            // first colon in line
            if (fieldLength === -1) {
              fieldLength = position - lineStart;
            }
            break;
          // @ts-ignore
          case CONTROL_CHARS.CarriageReturn:
            discardTrailingNewline = true;
          // eslint-disable-next-line no-fallthrough
          case CONTROL_CHARS.NewLine:
            lineEnd = position;
            break;
        }
      }

      if (lineEnd === -1) {
        // We reached the end of the buffer but the line hasn't ended.
        // Wait for the next arr and then continue parsing:
        break;
      }

      // we've reached the line end, send it out:
      onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
      // we're now on the next line
      lineStart = position;
      fieldLength = -1;
    }

    if (lineStart === bufLength) {
      // we've finished reading it
      buffer = undefined;
      return;
    }

    if (lineStart !== 0) {
      // Create a new view into buffer beginning at lineStart so we don't
      // need to copy over the previous lines when we get the new arr:
      buffer = buffer.subarray(lineStart);
      position -= lineStart;
    }
  };
}

/**
 * Parses line buffers into EventSourceMessages.
 * @param {(message: SseMessage) => void} onMessage A function that will be called on each message.
 * @returns {(line: Uint8Array, fieldLength: number) => void} A function that should be called for each incoming line buffer.
 */
export function getMessages(onMessage) {
  let message = newMessage();
  const decoder = new TextDecoder();

  // return a function that can process each incoming line buffer:
  return function onLine(line, fieldLength) {
    if (line.length === 0) {
      // empty line denotes end of message. Trigger the callback and start a new message:
      onMessage?.(message);
      message = newMessage();
      return;
    }

    // exclude comments and lines with no values
    if (fieldLength > 0) {
      // line is of format "<field>:<value>" or "<field>: <value>"
      // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
      const field = decoder.decode(line.subarray(0, fieldLength));
      const valueOffset = fieldLength + (line[fieldLength + 1] === CONTROL_CHARS.Space ? 2 : 1);
      const value = decoder.decode(line.subarray(valueOffset));

      switch (field) {
        case 'data':
          // if this message already has data, append the new value to the old.
          // otherwise, just set to the new value:
          message.data = message.data ? message.data + '\n' + value : value;
          break;
        case 'event':
          message.event = value;
          break;
        case 'id':
          message.id = value;
          break;
        case 'retry': {
          const retry = parseInt(value, 10);
          // per spec, ignore non-integers
          if (!isNaN(retry)) {
            message.retry = retry;
          }
          break;
        }
      }
    }
  };
}

/**
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @returns {Uint8Array}
 */
function concat(a, b) {
  const res = new Uint8Array(a.length + b.length);
  res.set(a);
  res.set(b, a.length);
  return res;
}

/**
 * @returns {SseMessage}
 */
function newMessage() {
  // data, event, and id must be initialized to empty strings:
  // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
  // retry should be initialized to undefined so we return a consistent shape
  // to the js engine all the time: https://mathiasbynens.be/notes/shapes-ics#takeaways
  return {
    data: '',
    event: '',
    id: '',
    retry: undefined,
  };
}
