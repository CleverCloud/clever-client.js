import { Polling } from '../../src/utils/polling.js';
import { sleep } from './timers.js';

/**
 * Retries a function until it returns a non-null value or timeout is reached, or max retries is reached.
 *
 * @param fn - The function to retry. Should return a non-null value on success or null/undefined to retry.
 * @param options - Retry configuration options.
 * @returns A promise that resolves with the function's return value or rejects on timeout.
 */
export async function retry<T>(
  fn: () => T | Promise<T>,
  {
    interval,
    timeout,
    maxRetries,
    delay,
  }: {
    /** Time in milliseconds between retry attempts. */
    interval: number;
    /** Maximum time in milliseconds before giving up. */
    timeout: number;
    /** Maximum number of retry attempts. If not specified, retries until timeout. */
    maxRetries?: number;
    /** Initial delay in milliseconds before starting the first attempt. */
    delay?: number;
  },
): Promise<T> {
  if (delay != null && delay > 0) {
    await sleep(delay);
  }
  let retryCount = 0;
  const pollingWithTimeout = new Polling<T>(
    async () => {
      if (maxRetries != null && maxRetries > 0 && retryCount > maxRetries) {
        throw new Error(`Retry limit reached (${maxRetries})`);
      }
      retryCount++;
      try {
        const value = await fn();
        if (value == null) {
          return { stop: false };
        }
        return { stop: true, value: value };
      } catch {
        return { stop: false };
      }
    },
    interval,
    timeout,
  );
  return pollingWithTimeout.start();
}
