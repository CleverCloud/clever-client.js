// This code is adapted from https://github.com/Azure/fetch-event-source
// MIT License Copyright (c) Microsoft Corporation.

const CONTROL_CHARS = {
  NewLine: 10,
  CarriageReturn: 13,
  Space: 32,
  Colon: 58,
};

/**
 * Converts a ReadableStream into a callback pattern.
 * @param stream The input ReadableStream.
 * @param onChunk A function that will be called on each new byte chunk in the stream.
 * @returns {Promise<void>} A promise that will be resolved when the stream closes.
 */
export async function getBytes (stream, onChunk) {
  if ('getReader' in stream) {
    const reader = stream.getReader();
    let result;
    while (!(result = await reader.read()).done) {
      onChunk(result.value);
    }
    return;
  }

  for await (const chunk of stream) {
    onChunk(chunk);
  }
}

/**
 * Parses arbitary byte chunks into EventSource line buffers.
 * Each line should be of the format "field: value" and ends with \r, \n, or \r\n.
 * @param onLine A function that will be called on each new EventSource line.
 * @returns A function that should be called for each incoming byte chunk.
 */
export function getLines (onLine) {
  let buffer;
  // current read position
  let position;
  // length of the `field` portion of the line
  let fieldLength;
  let discardTrailingNewline = false;

  // return a function that can process each incoming byte chunk:
  return function onChunk (arr) {
    if (buffer === undefined) {
      buffer = arr;
      position = 0;
      fieldLength = -1;
    }
    else {
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
 * @param onId A function that will be called on each `id` field.
 * @param onRetry A function that will be called on each `retry` field.
 * @param onMessage A function that will be called on each message.
 * @returns A function that should be called for each incoming line buffer.
 */
export function getMessages (onMessage, onId, onRetry) {
  let message = newMessage();
  const decoder = new TextDecoder();

  // return a function that can process each incoming line buffer:
  return function onLine (line, fieldLength) {
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
          message.data = message.data
            ? message.data + '\n' + value
            : value;
          break;
        case 'event':
          message.event = value;
          break;
        case 'id':
          onId?.(message.id = value);
          break;
        case 'retry': {
          const retry = parseInt(value, 10);
          // per spec, ignore non-integers
          if (!isNaN(retry)) {
            onRetry?.(message.retry = retry);
          }
          break;
        }
      }
    }
  };
}

function concat (a, b) {
  const res = new Uint8Array(a.length + b.length);
  res.set(a);
  res.set(b, a.length);
  return res;
}

function newMessage () {
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
