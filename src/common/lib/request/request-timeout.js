import { CcClientError } from '../error/cc-client-errors.js';

/**
 * @typedef {import('../../types/request.types.js').RequestWrapper} RequestWrapper
 */

export const FIVE_MINUTES = 1000 * 60 * 5;

/**
 * @type {RequestWrapper}
 */
export const requestTimeout = async (request, handler) => {
  const timeoutDelay = request.timeout ?? FIVE_MINUTES;

  if (timeoutDelay <= 0) {
    return handler(request);
  }

  const ac = controllerWithSignal(request.signal);
  request.signal = ac.signal;

  /** @type {() => void} */
  let clear;

  const requestPromise = handler(request).finally(() => {
    clear?.();
  });
  const timeoutPromise = new Promise((_resolve, reject) => {
    const timeoutId = setTimeout(() => {
      ac.abort();
      reject(new CcClientError(`Timeout of ${timeoutDelay} ms exceeded`, 'TIMEOUT_EXCEEDED', request));
    }, timeoutDelay);
    clear = () => clearTimeout(timeoutId);
  });

  // note that the requestPromise won't be canceled even if it looses the race
  return Promise.race([requestPromise, timeoutPromise]);
};

/**
 * @param {AbortSignal|null} signal
 * @returns {AbortController}
 */
function controllerWithSignal(signal) {
  const ac = new AbortController();
  if (signal != null) {
    signal.addEventListener('abort', () => ac.abort(), { once: true });
  }
  return ac;
}
