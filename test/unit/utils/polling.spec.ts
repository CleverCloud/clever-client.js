import { describe, expect, it, vi } from 'vitest';
import { Polling } from '../../../src/utils/polling.js';
import { expectPromiseThrows } from '../../lib/expect-utils.js';

describe('polling', () => {
  it('should not timeout and return the right value', async () => {
    let count = 0;

    const polling = new Polling(
      async () => {
        count++;
        if (count === 3) {
          return { stop: true, value: 'value' };
        }
        return { stop: false };
      },
      100,
      1_000,
    );
    const result = await polling.start();

    expect(result).toBe('value');
  }, 1_100);

  it('should fail with interrupted when stopping', async () => {
    const polling = new Polling(
      async () => {
        return { stop: false };
      },
      100,
      1_000,
    );
    const pollingPromise = polling.start();
    await sleep(200);

    polling.stop();

    await expectPromiseThrows(pollingPromise, (err) => {
      expect(err.message).toBe('Interrupted');
    });
  }, 1_100);

  it('should tick the right amount of time', async () => {
    const spy = vi.fn();

    let count = 0;
    const polling = new Polling(
      async () => {
        spy();
        count++;
        if (count === 3) {
          return { stop: true, value: 'value' };
        }
        return { stop: false };
      },
      100,
      1_000,
    );
    await polling.start();

    expect(spy).toHaveBeenCalledTimes(3);
  }, 1_100);
});

/**
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
