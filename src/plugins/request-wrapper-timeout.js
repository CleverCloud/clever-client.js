/**
 * @typedef {import('./plugins.type.js').RequestWrapperPlugin} RequestWrapperPlugin
 */
import { CleverClientError } from '../errors/clever-client-errors.js';

export const FIVE_MINUTES = 1000 * 60 * 5;

/**
 * @param {number} [defaultTimeout] The default timeout that can also be overridden by the `requestParam.timeout`. Fallback to 5 minutes.
 * @returns {RequestWrapperPlugin}
 */
export const requestWrapperTimeout = (defaultTimeout) => ({
  type: 'requestWrapper',
  async handle (requestParams, handler) {
    const timeoutDelay = (requestParams.timeout ?? defaultTimeout) ?? FIVE_MINUTES;

    if (timeoutDelay <= 0) {
      return handler(requestParams);
    }

    const ac = controllerWithSignal(requestParams.signal);
    requestParams.signal = ac.signal;

    /** @type {() => void} */
    let clear;

    const requestPromise = handler(requestParams).finally(() => {
      clear?.();
    });
    const timeoutPromise = new Promise((_resolve, reject) => {
      const timeoutId = setTimeout(() => {
        ac.abort();
        reject(new CleverClientError(`Timeout of ${timeoutDelay} ms exceeded`, 'TIMEOUT_EXCEEDED', requestParams));
      }, timeoutDelay);
      clear = () => clearTimeout(timeoutId);
    });

    // note that the requestPromise won't be canceled even if it looses the race
    return Promise.race([requestPromise, timeoutPromise]);
  },
});

/**
 * @param {AbortSignal|null} signal
 * @returns {AbortController}
 */
function controllerWithSignal (signal) {
  const ac = new AbortController();
  if (signal != null) {
    signal.addEventListener('abort', () => ac.abort(), { once: true });
  }
  return ac;
}
