import { describe, expect, it, vi } from 'vitest';
import {
  isInterruptedError,
  isTimeoutError,
  Polling,
  PollingInterruptedError,
  PollingTimeoutError,
} from '../../../src/utils/polling.js';
import { expectPromiseThrows } from '../../lib/expect-utils.js';
import { brandAsForeignCopy } from '../../lib/foreign-copy.js';

describe('polling', () => {
  it('should not timeout and return the right value', async () => {
    let count = 0;

    const polling = new Polling(
      async () => {
        await sleep(1);
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
        await sleep(1);
        return { stop: false };
      },
      100,
      1_000,
    );
    const pollingPromise = polling.start();
    await sleep(200);

    polling.stop();

    await expectPromiseThrows(pollingPromise, (err: Error) => {
      expect(err.message).toBe('Interrupted');
    });
  }, 1_100);

  it('should tick the right amount of time', async () => {
    const spy = vi.fn();

    let count = 0;
    const polling = new Polling(
      async () => {
        spy();
        await sleep(1);
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

  it.for([
    ['PollingInterruptedError', () => new PollingInterruptedError()],
    ['PollingTimeoutError', () => new PollingTimeoutError()],
  ] as const)('should name a %s after its class, as the native errors do', ([name, create]) => {
    const error = create();

    expect(error.name).toBe(name);
    expect(String(error)).toBe(`${name}: ${error.message}`);
    expect(Object.hasOwn(error, 'name')).toBe(false);
  });

  it('should recognize the polling errors', () => {
    expect(isTimeoutError(new PollingTimeoutError())).toBe(true);
    expect(isTimeoutError(new PollingInterruptedError())).toBe(false);
    expect(isInterruptedError(new PollingInterruptedError())).toBe(true);
    expect(isInterruptedError(new PollingTimeoutError())).toBe(false);
    expect(isTimeoutError(new Error('Timeout'))).toBe(false);
  });

  it('should recognize the polling errors raised by another copy of the client', () => {
    class ForeignPollingTimeoutError extends Error {
      static {
        brandAsForeignCopy(this.prototype, 'PollingTimeoutError');
      }
    }
    class ForeignPollingInterruptedError extends Error {
      static {
        brandAsForeignCopy(this.prototype, 'PollingInterruptedError');
      }
    }

    expect(isTimeoutError(new ForeignPollingTimeoutError())).toBe(true);
    expect(isInterruptedError(new ForeignPollingTimeoutError())).toBe(false);
    expect(isInterruptedError(new ForeignPollingInterruptedError())).toBe(true);
    expect(isTimeoutError(new ForeignPollingInterruptedError())).toBe(false);
  });
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
