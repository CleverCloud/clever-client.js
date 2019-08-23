const RETRY_DELAY = 1500;
const RETRY_TIMEOUT = 8000;
const PING_TIMOUT_FACTOR = 1.25;

export const AUTHENTICATION_REASON = {
  type: 'close',
  wasClean: true,
  reason: 'Authentication failure',
  code: 4001,
};

export const FORCE_CLOSE_REASON = {
  type: 'close',
  wasClean: true,
  reason: 'Close forced by client',
  code: 4002,
};

export class AbstractStream {

  openStream () {
    throw new Error('Not implemented');
  }

  isPingMessage (data) {
    return (data != null) && (data.type === 'heartbeat') && (data.heartbeat_msg === 'ping');
  }

  // Opens a stream that emits pings with this.openStream({ onMessage, onPing, onClose })
  // Automatically re-opens the stream if it gets closed for unknown reason
  // Automatically re-opens the stream if no ping is received within the expected timeframe
  // You can set { infinite: false } with some retry params { retryTimeout, retryDelay }
  // returns a function to close the stream
  openResilientStream ({ onMessage, onError, infinite = true, retryTimeout = RETRY_TIMEOUT, retryDelay = RETRY_DELAY }) {

    let retryCounter = 0;
    const maxRetryCount = Math.round(retryTimeout / retryDelay);
    let doCloseStream;
    let pingTimeoutId;

    const closeStream = (reason) => {
      if (doCloseStream != null) {
        doCloseStream(reason);
      }
    };

    const onPing = (delay) => {
      retryCounter = 0;
      clearTimeout(pingTimeoutId);
      pingTimeoutId = setTimeout(closeStream, delay * PING_TIMOUT_FACTOR);
    };

    const onClose = (reason) => {
      if (reason != null && reason.code === AUTHENTICATION_REASON.code) {
        return onError(new Error(AUTHENTICATION_REASON.reason));
      }
      if (reason != null && reason.code === FORCE_CLOSE_REASON.code) {
        clearTimeout(pingTimeoutId);
        // should we trigger some callback ?
        return;
      }
      setTimeout(tryToOpenStream, RETRY_DELAY);
    };

    const tryToOpenStream = () => {
      retryCounter += 1;
      if (!infinite && retryCounter > maxRetryCount) {
        return onError(new Error(`Stream connection failed ${maxRetryCount} times!`));
      }
      this.openStream({ onMessage, onPing, onClose })
        .then((newCloseStreamFn) => {
          doCloseStream = newCloseStreamFn;
        })
        .catch(onError);
    };

    tryToOpenStream();

    return () => closeStream(FORCE_CLOSE_REASON);
  }
}
