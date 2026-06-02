import { combineWithSignal } from '../utils.js';

// TODO: replace this by using AbortSignal.timeout() static method when it becomes widely available

export function fetchWithTimeout(
  timeout: number,
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> {
  function doFetch(signal: AbortSignal): Promise<Response> {
    return fetch(input, { ...init, signal });
  }

  if (timeout <= 0) {
    return doFetch(init.signal);
  }

  const ac = new AbortController();
  combineWithSignal(ac, init.signal);

  let clear: () => void;

  const requestPromise = doFetch(ac.signal).finally(() => {
    clear?.();
  });
  const timeoutPromise = new Promise<Response>((_resolve, reject) => {
    const timeoutId = setTimeout(() => {
      ac.abort();
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- 'TIMEOUT' is a sentinel matched by `error === 'TIMEOUT'` in doRequest
      reject('TIMEOUT');
    }, timeout);
    clear = () => clearTimeout(timeoutId);
  });

  return Promise.race([requestPromise, timeoutPromise]);
}
