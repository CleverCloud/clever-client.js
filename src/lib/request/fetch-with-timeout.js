import { combineWithSignal } from '../utils.js';

// TODO: replace this by using AbortSignal.timeout() static method when it becomes widely available

/**
 * @param {number} timeout
 * @param {string | URL | Request} input
 * @param {RequestInit} [init]
 * @returns {Promise<Response>}
 */
export function fetchWithTimeout(timeout, input, init) {
  /**
   * @param {AbortSignal} signal
   * @return {Promise<Response>}
   */
  function doFetch(signal) {
    return fetch(input, { ...init, signal });
  }

  if (timeout <= 0) {
    return doFetch(init.signal);
  }

  const ac = new AbortController();
  combineWithSignal(ac, init.signal);

  /** @type {() => void} */
  let clear;

  const requestPromise = doFetch(ac.signal).finally(() => {
    clear?.();
  });
  const timeoutPromise = new Promise((_resolve, reject) => {
    const timeoutId = setTimeout(() => {
      ac.abort();
      reject('TIMEOUT');
    }, timeout);
    clear = () => clearTimeout(timeoutId);
  });

  return Promise.race([requestPromise, timeoutPromise]);
}
