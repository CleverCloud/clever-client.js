import type { NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CcClientError, CcRequestError } from '../../../../src/lib/error/cc-client-errors.js';
import { HeadersBuilder } from '../../../../src/lib/request/headers-builder.js';
import { QueryParams } from '../../../../src/lib/request/query-params.js';
import { sendRequest as originalSendRequest } from '../../../../src/lib/request/request.js';
import type { CcRequest, CcResponse } from '../../../../src/types/request.types.js';
import { expectPromiseThrows } from '../../../lib/expect-utils.js';

describe('request', () => {
  let newScenario: NewScenario;

  const hooks = doublureHooks();

  beforeAll(async () => {
    newScenario = await hooks.before();
  });
  beforeEach(hooks.beforeEach);
  afterEach(() => {
    vi.restoreAllMocks();
  });
  afterAll(hooks.after);

  async function sendRequest(request: Partial<CcRequest>): Promise<CcResponse<unknown>> {
    return originalSendRequest({
      cors: false,
      timeout: 0,
      cache: null,
      debug: false,
      method: 'GET',
      ...request,
      url: request.url!.startsWith('http') ? request.url! : `${newScenario.mockClient.baseUrl}${request.url}`,
    });
  }

  describe('sendRequest', () => {
    it('should successfully make a GET request', async () => {
      const responseBody = { data: 'test response' };

      await newScenario()
        .when({ method: 'GET', path: '/api/test' })
        .respond({ status: 200, body: responseBody })
        .thenCall(() =>
          sendRequest({
            method: 'GET',
            url: `/api/test`,
            headers: new HeadersBuilder().acceptJson().build(),
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.method).toBe('GET');
          expect(calls.first.path).toBe('/api/test');
          expect(calls.first.headers.accept).toBe('application/json');
          expect(calls.first.response).toEqual({ status: 200, body: responseBody });
        });
    });

    it('should make a GET request with query parameters', async () => {
      const queryParams = new QueryParams()
        .append('param1', 'value1')
        .append('param2', 'value2')
        .append('param2', 'value3');

      await newScenario()
        .when({ method: 'GET', path: '/api/test' })
        .respond({ status: 200 })
        .thenCall(() =>
          sendRequest({
            method: 'GET',
            url: `/api/test`,
            queryParams,
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.queryParams.param1).toBe('value1');
          expect(calls.first.queryParams.param2).toEqual(['value2', 'value3']);
        });
    });

    it('should make a GET request with headers', async () => {
      await newScenario()
        .when({ method: 'GET', path: '/api/test' })
        .respond({ status: 200 })
        .thenCall(() =>
          sendRequest({
            method: 'GET',
            url: `/api/test`,
            headers: new HeadersBuilder().acceptJson().withHeader('x-custom', 'x-value').build(),
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.headers['x-custom']).toBe('x-value');
        });
    });

    it('should successfully make a POST request with JSON body', async () => {
      const requestBody = { request: 'body' };
      const responseBody = { response: 'body' };

      await newScenario()
        .when({ method: 'POST', path: '/api/test' })
        .respond({ status: 201, body: responseBody })
        .thenCall(() =>
          sendRequest({
            method: 'POST',
            url: `/api/test`,
            headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
            body: requestBody,
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.method).toBe('POST');
          expect(calls.first.path).toBe('/api/test');
          expect(calls.first.body).toEqual(requestBody);
          expect(calls.first.path).toBe('/api/test');
          expect(calls.first.headers.accept).toBe('application/json');
          expect(calls.first.headers['content-type']).toBe('application/json');
          expect(calls.first.response).toEqual({ status: 201, body: responseBody });
        });
    });

    it('should successfully make a POST request with string body', async () => {
      const requestBody = 'request body';
      const responseBody = { response: 'body' };

      await newScenario()
        .when({ method: 'POST', path: '/api/test' })
        .respond({ status: 201, body: responseBody })
        .thenCall(() =>
          sendRequest({
            method: 'POST',
            url: `/api/test`,
            headers: new HeadersBuilder().contentTypeTextPlain().build(),
            body: requestBody,
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.method).toBe('POST');
          expect(calls.first.path).toBe('/api/test');
          expect(calls.first.body).toEqual(requestBody);
          expect(calls.first.headers['content-type']).toBe('text/plain');
          expect(calls.first.response).toEqual({ status: 201, body: responseBody });
        });
    });

    it('should successfully make a PUT request with JSON body', async () => {
      const requestBody = { request: 'body' };
      const responseBody = { response: 'body' };

      await newScenario()
        .when({ method: 'PUT', path: '/api/test' })
        .respond({ status: 200, body: responseBody })
        .thenCall(() =>
          sendRequest({
            method: 'PUT',
            url: `/api/test`,
            headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
            body: requestBody,
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.method).toBe('PUT');
          expect(calls.first.path).toBe('/api/test');
          expect(calls.first.body).toEqual(requestBody);
          expect(calls.first.headers.accept).toBe('application/json');
          expect(calls.first.headers['content-type']).toBe('application/json');
          expect(calls.first.response).toEqual({ status: 200, body: responseBody });
        });
    });

    it('should successfully make a PATCH request with JSON body', async () => {
      const requestBody = { request: 'body' };
      const responseBody = { response: 'body' };

      await newScenario()
        .when({ method: 'PATCH', path: '/api/test' })
        .respond({ status: 200, body: responseBody })
        .thenCall(() =>
          sendRequest({
            method: 'PATCH',
            url: `/api/test`,
            headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
            body: requestBody,
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.method).toBe('PATCH');
          expect(calls.first.path).toBe('/api/test');
          expect(calls.first.body).toEqual(requestBody);
          expect(calls.first.headers.accept).toBe('application/json');
          expect(calls.first.headers['content-type']).toBe('application/json');
          expect(calls.first.response).toEqual({ status: 200, body: responseBody });
        });
    });

    it('should successfully make a DELETE request', async () => {
      await newScenario()
        .when({ method: 'DELETE', path: '/api/test' })
        .respond({ status: 204 })
        .thenCall(() =>
          sendRequest({
            method: 'DELETE',
            url: `/api/test`,
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.method).toBe('DELETE');
          expect(calls.first.path).toBe('/api/test');
          expect(calls.first.response).toEqual({ status: 204 });
        });
    });

    it('should successfully make a HEAD request', async () => {
      await newScenario()
        .when({ method: 'HEAD', path: '/api/test' })
        .respond({ status: 200 })
        .thenCall(() =>
          sendRequest({
            method: 'HEAD',
            url: `/api/test`,
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.method).toBe('HEAD');
          expect(calls.first.path).toBe('/api/test');
          expect(calls.first.response).toEqual({ status: 200 });
        });
    });

    it('should handle JSON response', async () => {
      const responseBody = { response: 'body' };

      await newScenario()
        .when({ method: 'GET', path: '/api/json' })
        .respond({ status: 200, body: responseBody })
        .thenCall(() =>
          sendRequest({
            method: 'GET',
            url: `/api/json`,
            headers: new HeadersBuilder().acceptJson().build(),
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.response).toEqual({ status: 200, body: responseBody });
        });
    });

    it('should handle plain text response', async () => {
      const responseBody = 'response body';

      await newScenario()
        .when({ method: 'GET', path: '/api/json' })
        .respond({ status: 200, body: responseBody })
        .thenCall(() =>
          sendRequest({
            method: 'GET',
            url: `/api/json`,
            headers: new HeadersBuilder().acceptTextPlain().build(),
          }),
        )
        .verify((calls) => {
          expect(calls.count).toBe(1);
          expect(calls.first.response).toEqual({ status: 200, body: responseBody });
        });
    });

    it('should handle network errors', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
        throw new TypeError('Failed to fetch');
      });

      await expectPromiseThrows(
        sendRequest({
          method: 'GET',
          url: 'https://example.com/api/error',
        }),
        (error: CcRequestError) => {
          expect(error).toBeInstanceOf(CcRequestError);
          expect(error.code).toBe('NETWORK_ERROR');
          expect(error.message).toContain('A network error occurred');
        },
      );
    });

    it('should handle invalid URLs', async () => {
      await expectPromiseThrows(
        sendRequest({
          method: 'GET',
          url: 'http://:\\invalid-url',
        }),
        (error: CcRequestError) => {
          expect(error).toBeInstanceOf(CcRequestError);
          expect(error.code).toBe('INVALID_URL');
          expect(error.message).toContain('Invalid URL');
        },
      );
    });

    it('should handle unexpected errors', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
        throw new TypeError('Unexpected Test error');
      });

      await expectPromiseThrows(
        sendRequest({
          method: 'GET',
          url: 'https://example.com/api/error',
          headers: new HeadersBuilder().build(),
        }),
        (error: CcRequestError) => {
          expect(error).toBeInstanceOf(CcRequestError);
          expect(error.code).toBe('UNEXPECTED_ERROR');
          expect(error.message).toContain('An unexpected error occurred');
        },
      );
    });

    it('should set CORS mode when specified', async () => {
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 201 });
      const spy = vi.spyOn(globalThis, 'fetch');

      await sendRequest({
        method: 'GET',
        url: `/api/test`,
        cors: true,
      });

      expect(spy.mock.lastCall![1]!.mode).toBe('cors');
    });
  });

  describe('cache', () => {
    it('should use cached response', async () => {
      const responseBody = { data: 'test response' };
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200, body: responseBody });
      await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        cache: { ttl: 1000 },
      });

      const spy = vi.spyOn(globalThis, 'fetch');

      const response = await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        cache: { ttl: 1000 },
      });

      expect(spy).toHaveBeenCalledTimes(0);
      expect(response.body).toEqual(responseBody);
    });

    it('should not use cached response', async () => {
      await newScenario()
        .when({ method: 'GET', path: '/api/test' })
        .respond({ status: 200, body: { data: 'test response' } });
      await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        cache: { ttl: 1000 },
      });

      const spy = vi.spyOn(globalThis, 'fetch');

      await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        cache: null,
      });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should reload cached response', async () => {
      await newScenario()
        .when({ method: 'GET', path: '/api/test' })
        .respond({ status: 200, body: { data: 'test response' } });
      await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        cache: { ttl: 1000 },
      });

      const newResponseBody = { data: 'fresh new test response' };
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200, body: newResponseBody });
      const spy = vi.spyOn(globalThis, 'fetch');

      const response = await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        cache: { mode: 'reload', ttl: 1000 },
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(newResponseBody);

      spy.mockClear();
      const response2 = await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        cache: { ttl: 1000 },
      });
      expect(spy).toHaveBeenCalledTimes(0);
      expect(response2.body).toEqual(newResponseBody);
    });

    it('should NOT share cache between different query params', async () => {
      const responseBody = { data: 'response' };
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200, body: responseBody });

      const spy = vi.spyOn(globalThis, 'fetch');

      const result1 = await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        queryParams: new QueryParams().set('page', 'a'),
        cache: { ttl: 1000 },
      });

      const result2 = await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        queryParams: new QueryParams().set('page', 'b'),
        cache: { ttl: 1000 },
      });

      // Each unique query param set should hit the network independently
      expect(spy).toHaveBeenCalledTimes(2);
      expect(result1.body).toEqual(responseBody);
      expect(result2.body).toEqual(responseBody);
    });

    it('should share cache for same query params', async () => {
      const responseBody = { data: 'cached' };
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200, body: responseBody });

      await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        queryParams: new QueryParams().set('page', '1'),
        cache: { ttl: 1000 },
      });

      const spy = vi.spyOn(globalThis, 'fetch');

      const response = await sendRequest({
        method: 'GET',
        url: `/api/test`,
        headers: new HeadersBuilder().acceptJson().build(),
        queryParams: new QueryParams().set('page', '1'),
        cache: { ttl: 1000 },
      });

      expect(spy).toHaveBeenCalledTimes(0);
      expect(response.body).toEqual(responseBody);
    });
  });

  describe('dedupe', () => {
    it('concurrent same request should make only 1 fetch call', async () => {
      const responseBody = { data: 'test response' };
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200, body: responseBody });

      const spy = vi.spyOn(globalThis, 'fetch');

      const [result1, result2] = await Promise.all([
        sendRequest({ url: '/api/test' }),
        sendRequest({ url: '/api/test' }),
      ]);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result1.body).toEqual(responseBody);
      expect(result2.body).toEqual(responseBody);
    });

    it('concurrent different requests should make 2 fetch calls', async () => {
      const response1Body = { data: 'response 1' };
      const response2Body = { data: 'response 2' };
      await newScenario()
        .when({ method: 'GET', path: '/api/test1' })
        .respond({ status: 200, body: response1Body })
        .when({ method: 'GET', path: '/api/test2' })
        .respond({ status: 200, body: response2Body });

      const spy = vi.spyOn(globalThis, 'fetch');

      const [result1, result2] = await Promise.all([
        sendRequest({ url: '/api/test1' }),
        sendRequest({ url: '/api/test2' }),
      ]);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(result1.body).toEqual(response1Body);
      expect(result2.body).toEqual(response2Body);
    });

    it('sequential same request should make 2 fetch calls (dedupe only applies while pending)', async () => {
      const responseBody = { data: 'test response' };
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200, body: responseBody });

      const spy = vi.spyOn(globalThis, 'fetch');

      const result1 = await sendRequest({ url: '/api/test' });
      const result2 = await sendRequest({ url: '/api/test' });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(result1.body).toEqual(responseBody);
      expect(result2.body).toEqual(responseBody);
    });

    it('concurrent requests with different query params should make separate fetch calls', async () => {
      const responseBody = { data: 'response' };
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200, body: responseBody });

      const spy = vi.spyOn(globalThis, 'fetch');

      const [result1, result2] = await Promise.all([
        sendRequest({ url: '/api/test', queryParams: new QueryParams().set('page', 'a') }),
        sendRequest({ url: '/api/test', queryParams: new QueryParams().set('page', 'b') }),
      ]);

      // Different query params should NOT be deduplicated together
      expect(spy).toHaveBeenCalledTimes(2);
      expect(result1.body).toEqual(responseBody);
      expect(result2.body).toEqual(responseBody);
    });

    it('concurrent requests with same query params should be deduplicated to a single fetch', async () => {
      const responseBody = { data: 'deduped' };
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200, body: responseBody });

      const spy = vi.spyOn(globalThis, 'fetch');

      const [result1, result2] = await Promise.all([
        sendRequest({ url: '/api/test', queryParams: new QueryParams().set('page', '1') }),
        sendRequest({ url: '/api/test', queryParams: new QueryParams().set('page', '1') }),
      ]);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result1.body).toEqual(responseBody);
      expect(result2.body).toEqual(responseBody);
    });
  });

  describe('timeout', () => {
    it('should timeout', async () => {
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200 }, 20);

      await expectPromiseThrows(
        sendRequest({
          method: 'GET',
          url: `/api/test`,
          timeout: 10,
        }),
        (error: CcClientError) => {
          expect(error).toBeInstanceOf(CcClientError);
          expect(error.code).toBe('TIMEOUT_EXCEEDED');
          expect(error.message).toContain(`Timeout of 10 ms exceeded`);
        },
      );
    }, 50);

    it('should not timeout', async () => {
      await newScenario().when({ method: 'GET', path: '/api/test' }).respond({ status: 200 }, 20);

      await sendRequest({
        method: 'GET',
        url: `/api/test`,
        timeout: 50,
      });
    }, 50);
  });
});
