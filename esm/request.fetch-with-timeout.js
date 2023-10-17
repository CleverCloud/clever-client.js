export const FIVE_MINUTES = 1000 * 60 * 5;
export const THIRTY_SECONDS = 1000 * 30;

export function fetchWithTimeout (url, params, timeoutDelay) {

  const ac = controllerWithSignal(params.signal);

  let timeoutId;

  const fetchPromise = fetch(url, { ...params, signal: ac.signal });
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      ac.abort();
      reject(new Error('TimeoutError'));
    }, timeoutDelay || FIVE_MINUTES);
  });

  fetchPromise.finally(() => clearTimeout(timeoutId));

  return Promise.race([fetchPromise, timeoutPromise]);
}

function controllerWithSignal (signal) {
  const ac = new AbortController();
  if (signal != null) {
    signal.addEventListener('abort', () => ac.abort(), { once: true });
  }
  return ac;
}
