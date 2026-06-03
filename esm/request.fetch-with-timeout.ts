export const FIVE_MINUTES = 1000 * 60 * 5;
export const THIRTY_SECONDS = 1000 * 30;

export function fetchWithTimeout(url: string, params: RequestInit, timeoutDelay?: number): Promise<Response> {
  const ac = controllerWithSignal(params.signal);

  let timeoutId: any;

  const fetchPromise = fetch(url, { ...params, signal: ac.signal });
  const timeoutPromise = new Promise<Response>((_resolve, reject) => {
    timeoutId = setTimeout(() => {
      ac.abort();
      reject(new Error('TimeoutError'));
    }, timeoutDelay || FIVE_MINUTES);
  });

  void fetchPromise.finally(() => clearTimeout(timeoutId));

  return Promise.race([fetchPromise, timeoutPromise]);
}

function controllerWithSignal(signal: AbortSignal): AbortController {
  const ac = new AbortController();
  if (signal != null) {
    signal.addEventListener('abort', () => ac.abort(), { once: true });
  }
  return ac;
}
