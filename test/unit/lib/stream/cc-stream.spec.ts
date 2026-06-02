import type { MockSseEvent, NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CcClientError, CcHttpError } from '../../../../src/lib/error/cc-client-errors.js';
import { HeadersBuilder } from '../../../../src/lib/request/headers-builder.js';
import { QueryParams } from '../../../../src/lib/request/query-params.js';
import { requestWithCache } from '../../../../src/lib/request/request-with-cache.js';
import { CcStream } from '../../../../src/lib/stream/cc-stream.js';
import type { CcStreamConfig } from '../../../../src/lib/stream/cc-stream.types.js';
import type { CcRequest } from '../../../../src/types/request.types.js';
import { sleep } from '../../../lib/timers.js';
import type { SpiedStream, Stubs } from './cc-stream.spec.types.js';

const END_OF_STREAM: MockSseEvent = { type: 'message', event: 'END_OF_STREAM', data: { endedBy: 'UNTIL_REACHED' } };
const HEARTBEAT: MockSseEvent = { type: 'message', event: 'HEARTBEAT' };
const CLOSE_STREAM: MockSseEvent = { type: 'close' };
const MESSAGE: MockSseEvent = { type: 'message', event: 'EVENT', data: 'hello' };

const RETRY = { maxRetryCount: 2, initRetryTimeout: 10, backoffFactor: 1 };

describe('cc-stream', () => {
  let newScenario: NewScenario;

  let cleanStream: (() => void) | null;

  const hooks = doublureHooks();

  beforeAll(async () => {
    newScenario = await hooks.before();
  });
  beforeEach(hooks.beforeEach);
  afterEach(() => {
    vi.restoreAllMocks();
    cleanStream?.();
  });
  afterAll(hooks.after);

  function createAndSpyStream(request: Partial<CcRequest>, config: Partial<CcStreamConfig> = {}): SpiedStream {
    cleanStream?.();

    const stubs: Stubs = {
      request: vi.fn(),
      open: vi.fn(),
      error: vi.fn(),
      event: vi.fn(),
      success: vi.fn(),
      failure: vi.fn(),
    };

    const stream = new CcStream(
      () => {
        stubs.request();
        return {
          cors: false,
          timeout: 0,
          cache: null,
          debug: false,
          method: 'GET',
          ...request,
          url: request.url.startsWith('http') ? request.url : `${newScenario.mockClient.baseUrl}${request.url}`,
        };
      },
      {
        retry: null,
        debug: false,
        heartbeatPeriod: 20,
        healthcheckInterval: 10,
        ...config,
      },
    );

    cleanStream = () => {
      cleanStream = null;
      stream.close({ type: 'END_OF_TEST' });
    };

    stream
      .onOpen(stubs.open)
      .onError(stubs.error)
      .on('EVENT', (evt) => stubs.event(evt.data));

    return {
      stream,
      async start() {
        try {
          const result = await stream.start();
          stubs.success(result);
          return result;
        } catch (e) {
          // Failures are asserted through the `failure` stub (see `verifyCounts`), and the
          // failure-path tests call `start()` fire-and-forget. We must not rethrow here, or
          // the unawaited rejection would surface as an unhandled rejection and fail the run.
          stubs.failure(e);
        }
      },
      close(reason) {
        stream.close(reason);
      },
      async verifyCounts(expectedCounts, maxWait = 0) {
        const startTimestamp = Date.now();

        while (true) {
          try {
            const currentCounts = Object.fromEntries(
              Object.entries(stubs)
                .filter(([key]) => key in expectedCounts)
                .map(([key, stub]) => [key, (stub as { mock: { calls: Array<unknown> } }).mock.calls.length]),
            );
            expect(currentCounts).toEqual(expectedCounts);
            return;
          } catch (e) {
            if (e instanceof Error && e.name === 'AssertionError') {
              const duration = Date.now() - startTimestamp;
              if (maxWait <= 0 || duration >= maxWait) {
                throw e;
              } else {
                await sleep(3);
              }
            } else {
              throw e;
            }
          }
        }
      },
      stubs,
    };
  }

  it('starting stream should call the request factory', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });

    void spiedStream.start();

    await spiedStream.verifyCounts({ request: 1 });
  });

  it('GET request should open stream', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });
    await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({
        status: 200,
        events: [END_OF_STREAM],
        delayBetween: 10,
      });

    await spiedStream.start();

    await spiedStream.verifyCounts({ open: 1 });
  });

  it('POST request should open stream', async () => {
    const spiedStream = createAndSpyStream({ method: 'POST', url: '/' });
    await newScenario()
      .when({ method: 'POST', path: '/' })
      .respond({
        status: 200,
        events: [END_OF_STREAM],
        delayBetween: 10,
      });

    await spiedStream.start();

    await spiedStream.verifyCounts({ open: 1 });
  });

  it('should run expected Http request', async () => {
    const spiedStream = createAndSpyStream({
      method: 'POST',
      url: '/',
      body: 'body',
      headers: new HeadersBuilder().contentTypeTextPlain().withHeader('x-header', 'x-value').build(),
      queryParams: new QueryParams().append('param1', 'value1').append('param2', 'value2'),
    });
    await newScenario()
      .when({ method: 'POST', path: '/' })
      .respond({
        status: 200,
        events: [END_OF_STREAM],
        delayBetween: 10,
      })
      .thenCall(() => spiedStream.start())
      .verify((calls) => {
        expect(calls.count).toBe(1);
        expect(calls.first.method).toBe('POST');
        expect(calls.first.path).toBe('/');
        expect(calls.first.headers.accept).toBe('text/event-stream');
        expect(calls.first.headers['content-type']).toBe('text/plain');
        expect(calls.first.headers['x-header']).toBe('x-value');
        expect(calls.first.queryParams).toEqual({ param1: 'value1', param2: 'value2' });
      });

    await spiedStream.verifyCounts({ open: 1 });
  });

  it('should override accept header and cache config', async () => {
    // fake caching request response
    await requestWithCache(
      {
        method: 'GET',
        url: `${newScenario.mockClient.baseUrl}/`,
        headers: new HeadersBuilder().acceptEventStream().build(),
        cache: { ttl: 100 },
        cors: false,
        timeout: 0,
        debug: false,
      },
      () =>
        Promise.resolve({
          status: 200,
          headers: null,
          body: null,
          requestDuration: 0,
          cacheHit: false,
        }),
    );

    const spiedStream = createAndSpyStream({
      method: 'GET',
      url: '/',
      headers: new HeadersBuilder().acceptJson().build(),
      // cache should not be used even if we ask so
      cache: { ttl: 100 },
    });

    await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({
        status: 200,
        events: [END_OF_STREAM],
        delayBetween: 10,
      })
      .thenCall(() => spiedStream.start())
      .verify((calls) => {
        expect(calls.count).toBe(1);
        expect(calls.first.headers.accept).toBe('text/event-stream');
      });

    await spiedStream.verifyCounts({ open: 1 });
  });

  it('unknown url should lead to failure with CcHttpError', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });

    void spiedStream.start();

    await spiedStream.verifyCounts({ failure: 1 }, 20);
    expect(spiedStream.stubs.failure.mock.calls[0][0]).toBeInstanceOf(CcHttpError);
  });

  it('non 200 status code should lead to failure with CcHttpError', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });
    await newScenario().when({ method: 'GET', path: '/' }).respond({
      status: 400,
      body: 'invalid request',
    });

    void spiedStream.start();

    await spiedStream.verifyCounts({ failure: 1 }, 20);
    expect(spiedStream.stubs.failure.mock.calls[0][0]).toBeInstanceOf(CcHttpError);
  });

  it('invalid response content type should lead to failure with CcClientError', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });
    await newScenario().when({ method: 'GET', path: '/' }).respond({
      status: 200,
      body: 'invalid content type',
    });

    void spiedStream.start();

    await spiedStream.verifyCounts({ failure: 1 }, 20);
    expect(spiedStream.stubs.failure.mock.calls[0][0]).toBeInstanceOf(CcClientError);
    expect((spiedStream.stubs.failure.mock.calls[0][0] as CcClientError).code).toBe('SSE_INVALID_CONTENT_TYPE');
  });

  it('receiving END_OF_STREAM event should close stream properly', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });
    await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({
        status: 200,
        events: [END_OF_STREAM, CLOSE_STREAM],
        delayBetween: 10,
      });

    const result = await spiedStream.start();

    await spiedStream.verifyCounts({ success: 1, failure: 0 });
    expect(result).toEqual({ type: 'UNTIL_REACHED' });
  });

  it('should receive all events and close properly after END_OF_STREAM event', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });
    await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({
        status: 200,
        events: [
          { type: 'message', event: 'EVENT', data: 'hello John' },
          { type: 'message', event: 'EVENT', data: 'hello Jack' },
          { type: 'message', event: 'EVENT', data: 'hello Mary' },
          END_OF_STREAM,
        ],
        delayBetween: 10,
      });

    const result = await spiedStream.start();

    await spiedStream.verifyCounts({ event: 3, success: 1 });
    expect(result).toEqual({ type: 'UNTIL_REACHED' });
    expect(spiedStream.stubs.event.mock.calls[0][0]).toBe('hello John');
    expect(spiedStream.stubs.event.mock.calls[1][0]).toBe('hello Jack');
    expect(spiedStream.stubs.event.mock.calls[2][0]).toBe('hello Mary');
  });

  it('receiving heartbeat and events should not timeout', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });
    await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({
        status: 200,
        events: [
          HEARTBEAT,
          { type: 'message', event: 'EVENT', data: 'hello world' },
          { type: 'message', event: 'EVENT', data: 'hello world' },
          { type: 'message', event: 'EVENT', data: 'hello world' },
          { type: 'message', event: 'EVENT', data: 'hello world' },
          { type: 'message', event: 'EVENT', data: 'hello world' },
          HEARTBEAT,
          HEARTBEAT,
          HEARTBEAT,
          HEARTBEAT,
          END_OF_STREAM,
        ],
        delayBetween: 10,
      });

    await spiedStream.start();

    await spiedStream.verifyCounts({ open: 1, error: 0, event: 5, failure: 0 });
  });

  it('pause stream should not timeout', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });
    await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({
        status: 200,
        events: [HEARTBEAT],
        delayBetween: 10,
      });
    void spiedStream.start();
    await spiedStream.verifyCounts({ open: 1, error: 0, event: 0, failure: 0 }, 20);

    spiedStream.stream.pause();
    await sleep(100);

    await spiedStream.verifyCounts({ open: 1, error: 0, event: 0, failure: 0 });
  });

  it('resume stream should run request with last event ID header', async () => {
    const spiedStream = createAndSpyStream({ url: '/' });
    await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({
        status: 200,
        events: [
          { type: 'message', event: 'EVENT', id: '210041493:43875:0' },
          { type: 'message', event: 'EVENT', id: '210041493:43875:1' },
          { type: 'message', event: 'EVENT', id: '210041493:43875:2' },
        ],
        delayBetween: 10,
      })
      .thenCall(async () => {
        void spiedStream.start();
        // make sure the 3 events have been processed
        await spiedStream.verifyCounts({ event: 3 }, 50);
        spiedStream.stream.pause();
        await sleep(20);
        spiedStream.stream.resume();
        // make sure the re-open has been done avec resume
        await spiedStream.verifyCounts({ open: 2 }, 20);
      })
      .verify((calls) => {
        expect(calls.first.headers).not.toHaveProperty('last-event-id');
        expect(calls.last.headers['last-event-id']).toBe('210041493:43875:2');
      });
  });

  describe('without retry', () => {
    it('no more heartbeat should lead to failure without retry', async () => {
      const spiedStream = createAndSpyStream({ url: '/' });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 200,
          events: [HEARTBEAT],
          delayBetween: 10,
        });

      void spiedStream.start();

      await spiedStream.verifyCounts({ open: 1, error: 0, failure: 1 }, 50);
      expect((spiedStream.stubs.failure.mock.calls[0][0] as CcClientError).code).toBe('SSE_HEALTH_ERROR');
    });

    it('connection closed by server should lead to a failure without retry', async () => {
      const spiedStream = createAndSpyStream({ url: '/' });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 200,
          events: [{ type: 'message', event: 'EVENT', data: 'hello world' }, CLOSE_STREAM],
          delayBetween: 10,
        });

      void spiedStream.start();

      await spiedStream.verifyCounts({ open: 1, error: 0, failure: 1 }, 50);
      expect((spiedStream.stubs.failure.mock.calls[0][0] as CcClientError).code).toBe('SSE_SERVER_ERROR');
    });
  });

  describe('with retry', () => {
    it('400 status code should lead to failure without retry', async () => {
      const spiedStream = createAndSpyStream({ url: '/' }, { retry: RETRY });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 400,
          body: { message: '400' },
        });

      void spiedStream.start();

      await spiedStream.verifyCounts({ open: 0, error: 0, failure: 1 }, 50);
      expect(spiedStream.stubs.failure.mock.calls[0][0]).toBeInstanceOf(CcHttpError);
    });

    it('401 status code should lead to failure without retry', async () => {
      const spiedStream = createAndSpyStream({ url: '/' }, { retry: RETRY });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 401,
          body: { message: '401' },
        });

      void spiedStream.start();

      await spiedStream.verifyCounts({ open: 0, error: 0, failure: 1 }, 50);
      expect(spiedStream.stubs.failure.mock.calls[0][0]).toBeInstanceOf(CcHttpError);
    });

    it('403 status code should lead to failure without retry', async () => {
      const spiedStream = createAndSpyStream({ url: '/' }, { retry: RETRY });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 403,
          body: { message: '403' },
        });

      void spiedStream.start();

      await spiedStream.verifyCounts({ open: 0, error: 0, failure: 1 }, 50);
      expect(spiedStream.stubs.failure.mock.calls[0][0]).toBeInstanceOf(CcHttpError);
    });

    it('500 status code should lead to failure with retry', async () => {
      const spiedStream = createAndSpyStream({ url: '/' }, { retry: RETRY });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 500,
          body: { message: '500' },
        });

      void spiedStream.start();

      await spiedStream.verifyCounts({ open: 0, error: 2, failure: 1 }, 150);
      expect(spiedStream.stubs.failure.mock.calls[0][0]).toBeInstanceOf(CcHttpError);
    });

    it('408 status code should lead to failure with retry', async () => {
      const spiedStream = createAndSpyStream({ url: '/' }, { retry: RETRY });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 408,
          body: { message: '408' },
        });

      void spiedStream.start();

      await spiedStream.verifyCounts({ open: 0, error: 2, failure: 1 }, 150);
      expect(spiedStream.stubs.failure.mock.calls[0][0]).toBeInstanceOf(CcHttpError);
    });

    it('429 status code should lead to failure with retry', async () => {
      const spiedStream = createAndSpyStream({ url: '/' }, { retry: RETRY });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 429,
          body: { message: '429' },
        });

      void spiedStream.start();

      await spiedStream.verifyCounts({ open: 0, error: 2, failure: 1 }, 150);
      expect(spiedStream.stubs.failure.mock.calls[0][0]).toBeInstanceOf(CcHttpError);
    });

    it('[error 500 + error 500 + events] should be retried and succeed', async () => {
      const spiedStream = createAndSpyStream({ url: '/' }, { retry: RETRY });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 500,
          body: { message: '500' },
        });

      void spiedStream.start();

      // 1rst attempt (error 500) => error++
      await spiedStream.verifyCounts({ open: 0, error: 1 }, 40);

      // 1rst retry (error 500) => error++
      await spiedStream.verifyCounts({ open: 0, error: 2 }, 40);

      // 2nd retry (events) => open++ & event+=1 (& success because END_OF_STREAM)
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 200,
          events: [MESSAGE, END_OF_STREAM],
          delayBetween: 10,
        });

      await spiedStream.verifyCounts({ open: 1, error: 2, failure: 0, success: 1 }, 40);
    });

    it('[events + timeout + events] should be retried and succeed', async () => {
      const spiedStream = createAndSpyStream({ url: '/' }, { retry: RETRY });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 200,
          events: [MESSAGE, MESSAGE],
          delayBetween: 10,
        });

      void spiedStream.start();

      // 1rst attempt (events) => open++ & event+=2
      await spiedStream.verifyCounts({ open: 1, event: 2 }, 40);

      // 1rst retry (timeout) => error++
      await spiedStream.verifyCounts({ open: 1, event: 2, error: 1 }, 60);

      // 2nd retry (events) => open++ & event+=2
      await spiedStream.verifyCounts({ open: 2, event: 4, error: 1 }, 60);
    });

    it('[success + timeout + error 500 + error 500] should be retried and fail', async () => {
      const spiedStream = createAndSpyStream({ url: '/' }, { retry: RETRY });
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 200,
          events: [MESSAGE, MESSAGE],
          delayBetween: 10,
        });

      void spiedStream.start();

      // 1rst attempt (events) => open++ & event+=2
      await spiedStream.verifyCounts({ open: 1, event: 2, error: 0 }, 40);

      // 1rst retry (timeout) => error++
      await spiedStream.verifyCounts({ open: 1, event: 2, error: 1 }, 60);

      // 2nd retry (error 500) => error++ & failure
      await newScenario()
        .when({ method: 'GET', path: '/' })
        .respond({
          status: 500,
          body: { message: '500' },
        });
      await spiedStream.verifyCounts({ open: 1, event: 2, error: 2, failure: 1 }, 60);
    });
  });
});
