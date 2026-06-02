import type { NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CcAuthApiToken } from '../../../src/lib/auth/cc-auth-api-token.js';
import { CcAuth } from '../../../src/lib/auth/cc-auth.js';
import { CcClient } from '../../../src/lib/cc-client.js';
import { CompositeCommand, SimpleCommand } from '../../../src/lib/command/command.js';
import { CcHttpError } from '../../../src/lib/error/cc-client-errors.js';
import { GetUrl } from '../../../src/lib/get-url.js';
import { HeadersBuilder } from '../../../src/lib/request/headers-builder.js';
import { QueryParams } from '../../../src/lib/request/query-params.js';
import { get, post } from '../../../src/lib/request/request-params-builder.js';
import { CcStream } from '../../../src/lib/stream/cc-stream.js';
import type { CcStreamConfig, CcStreamRequestFactory } from '../../../src/lib/stream/cc-stream.types.js';
import { StreamCommand } from '../../../src/lib/stream/stream-command.js';
import type { CcClientConfig } from '../../../src/types/client.types.js';
import type { OnRequestHook, OnResponseHook } from '../../../src/types/hook.types.js';
import type {
  CcRequest,
  CcRequestConfigPartial,
  CcRequestParams,
  CcResponse,
} from '../../../src/types/request.types.js';
import { expectPromiseThrows } from '../../lib/expect-utils.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class TestSimpleCommand extends SimpleCommand<'test', void, any> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class TestCompositeCommand extends CompositeCommand<'test', void, any> {}

export abstract class TestGetUrl extends GetUrl<'test', void> {}

export abstract class TestStreamCommand extends StreamCommand<'test', void, CcStream> {
  createStream(requestFactory: CcStreamRequestFactory, config: CcStreamConfig): CcStream {
    return new CcStream(requestFactory, config);
  }
}

function simpleCommand(requestsParams: Partial<CcRequestParams>): TestSimpleCommand {
  return new (class MyCommand extends TestSimpleCommand {
    toRequestParams() {
      return requestsParams;
    }
  })();
}

function compositeCommand(result: unknown): TestCompositeCommand {
  return new (class MyCommand extends TestCompositeCommand {
    async compose() {
      return result;
    }
  })();
}

function getUrl(result: string) {
  return new (class MyGetUrl extends TestGetUrl {
    get() {
      return result;
    }
  })();
}

function streamCommand(requestsParams: Partial<CcRequestParams>): TestStreamCommand {
  return new (class MyCommand extends TestStreamCommand {
    toRequestParams() {
      return requestsParams;
    }
  })();
}

/**
 * This client is here just to make all protected methods public so that vitest can mock or spy those methods.
 */
class SpiedClient extends CcClient<'test'> {
  override async _transformCommandParams(
    command: Parameters<CcClient<'test'>['_transformCommandParams']>[0],
    _requestConfig: Parameters<CcClient<'test'>['_transformCommandParams']>[1],
  ): ReturnType<CcClient<'test'>['_transformCommandParams']> {
    return super._transformCommandParams(command, _requestConfig);
  }
  override async _transformStreamParams(
    command: Parameters<CcClient<'test'>['_transformStreamParams']>[0],
    _requestConfig: Parameters<CcClient<'test'>['_transformStreamParams']>[1],
  ): ReturnType<CcClient<'test'>['_transformStreamParams']> {
    return super._transformStreamParams(command, _requestConfig);
  }
  override async _compose<CommandOutput>(
    command: CompositeCommand<'test', unknown, CommandOutput>,
    requestConfig?: CcRequestConfigPartial,
  ): Promise<CommandOutput> {
    return super._compose(command, requestConfig);
  }
  override async _getCommandRequestParams(
    command: Parameters<CcClient<'test'>['_getCommandRequestParams']>[0],
    requestConfig: Parameters<CcClient<'test'>['_getCommandRequestParams']>[1],
  ): ReturnType<CcClient<'test'>['_getCommandRequestParams']> {
    return super._getCommandRequestParams(command, requestConfig);
  }
  override async _prepareRequest(
    requestParams: Parameters<CcClient<'test'>['_prepareRequest']>[0],
    requestConfig: Parameters<CcClient<'test'>['_prepareRequest']>[1],
  ): ReturnType<CcClient<'test'>['_prepareRequest']> {
    return super._prepareRequest(requestParams, requestConfig);
  }
  override async _handleResponse<CommandOutput>(
    response: CcResponse<CommandOutput>,
    request: CcRequest,
    command: SimpleCommand<'test', unknown, CommandOutput>,
  ): Promise<CommandOutput> {
    return super._handleResponse(response, request, command);
  }
}

describe('clever-client', () => {
  let client: SpiedClient;
  let newScenario: NewScenario;
  let closeStream: (() => void) | undefined;

  const hooks = doublureHooks();

  function createClient(config?: Omit<CcClientConfig, 'baseUrl'>, auth?: CcAuth | null): SpiedClient {
    return new SpiedClient({ ...config, baseUrl: newScenario.mockClient.baseUrl }, auth);
  }

  function startStream(stream: CcStream) {
    const result = stream.start();
    closeStream = () => {
      stream.close();
    };
    return result;
  }

  beforeAll(async () => {
    newScenario = await hooks.before();
    client = createClient();
  });
  beforeEach(hooks.beforeEach);
  afterEach(() => {
    vi.restoreAllMocks();
    closeStream?.();
  });
  afterAll(hooks.after);

  describe('simple command', () => {
    it('should call `_transformCommandParams` method with right params', async () => {
      const spy = vi.spyOn(client, '_transformCommandParams');
      const command = simpleCommand(get('/path/subPath'));

      const requestConfig = {};

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200, body: 'hello' })
        .thenCall(() => client.send(command, requestConfig));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(command);
      expect(spy.mock.calls[0][1]).toBe(requestConfig);
    });

    it('should call `_getCommandRequestParams` method with right params', async () => {
      const spy = vi.spyOn(client, '_getCommandRequestParams');
      const command = simpleCommand(get('/path/subPath'));

      const requestConfig = {};

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200 })
        .thenCall(() => client.send(command, requestConfig));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(command);
      expect(spy.mock.calls[0][1]).toBe(requestConfig);
    });

    it('should call `_prepareRequest` method with right params', async () => {
      const spy = vi.spyOn(client, '_prepareRequest');
      const command = simpleCommand(get('/path/subPath'));
      const requestConfig = {};

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200 })
        .thenCall(() => client.send(command, requestConfig));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].method).toBe('GET');
      expect(spy.mock.calls[0][0].url).toBe('/path/subPath');
      expect(spy.mock.calls[0][1]).toBe(requestConfig);
    });

    it('should call `command.toRequestParams` method with the transformed params', async () => {
      const transformedParams = { transformed: 'params' };
      vi.spyOn(client, '_transformCommandParams').mockReturnValue(Promise.resolve(transformedParams));

      const command = simpleCommand(get('/path/subPath'));
      const spy = vi.spyOn(command, 'toRequestParams');

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200 })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(transformedParams);
    });

    it('should call `auth.applyOnRequestParams()`', async () => {
      const auth = new CcAuthApiToken('token');
      const spy = vi.spyOn(auth, 'applyOnRequestParams');
      const client = createClient({}, auth);
      const command = simpleCommand(get('/path/subPath'));

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200 })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].method).toBe('GET');
      expect(spy.mock.calls[0][0].url).toBe('/path/subPath');
    });

    it('should call onRequest hook function', async () => {
      const spy = vi.fn<OnRequestHook>();
      const client = createClient({
        hooks: {
          onRequest: spy,
        },
      });
      const command = simpleCommand(get('/path/subPath'));

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200 })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].method).toBe('GET');
      expect(spy.mock.calls[0][0].url).toBe('/path/subPath');
      expect(spy.mock.calls[0][0].headers).not.toBe(null);
      expect(spy.mock.calls[0][0].headers).not.toBe(undefined);
      expect(spy.mock.calls[0][0].queryParams).not.toBe(null);
      expect(spy.mock.calls[0][0].queryParams).not.toBe(undefined);
    });

    it('should merge prepared request params from onRequest hook', async () => {
      const onRequest: OnRequestHook = (request) => {
        request.queryParams.set('hook', 'hook');
      };

      const client = createClient({ hooks: { onRequest } });
      const spy = vi.spyOn(client, '_prepareRequest');
      const command = simpleCommand(get('/path/subPath'));

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200 })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      const result = (await spy.mock.results[0].value) as CcRequest;

      expect(result.queryParams.get('hook')).toBe('hook');
    });

    it('should prepend url with baseUrl', async () => {
      const spy = vi.spyOn(client, '_prepareRequest');
      const command = simpleCommand(get('/path/subPath'));

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200 })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      const result = (await spy.mock.results[0].value) as CcRequest;
      expect(result.url).toBe(`${newScenario.mockClient.baseUrl}/path/subPath`);
    });

    it('should call `_handleResponse` with right parameters', async () => {
      const spy = vi.spyOn(client, '_handleResponse');
      const command = simpleCommand(get('/path/subPath'));

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200, body: 'body' })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      const [response, request, calledCommand] = spy.mock.calls[0];
      expect(response.body).toBe('body');
      expect(response.status).toBe(200);
      expect(request.method).toBe('GET');
      expect(request.url).toBe(`${newScenario.mockClient.baseUrl}/path/subPath`);
      expect(calledCommand).toBe(command);
    });

    it('should call `onResponse` hook with right parameters', async () => {
      const spy = vi.fn<OnResponseHook>();
      const client = createClient({ hooks: { onResponse: spy } });

      const command = simpleCommand(get('/path/subPath'));

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200, body: 'body' })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].body).toBe('body');
      expect(spy.mock.calls[0][0].status).toBe(200);
      expect(spy.mock.calls[0][1].method).toBe('GET');
      expect(spy.mock.calls[0][1].url).toBe(`${newScenario.mockClient.baseUrl}/path/subPath`);
    });

    it('should return `command.getEmptyResponse` when `getEmptyResponse.getEmptyResponsePolicy` returns an empty response', async () => {
      const spy = vi.spyOn(client, 'send');
      const command = simpleCommand(get('/path/subPath'));
      vi.spyOn(command, 'getEmptyResponsePolicy').mockReturnValue({ isEmpty: true, emptyValue: 'empty response' });

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200, body: 'body' })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(await spy.mock.results[0].value).toBe('empty response');
    });

    it('should call `command.transformCommandOutput` with right parameters', async () => {
      const command = simpleCommand(get('/path/subPath'));
      const spy = vi.spyOn(command, 'transformCommandOutput');

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200, body: 'body' })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe('body');
    });

    it('should return `command.transformCommandOutput`', async () => {
      const spy = vi.spyOn(client, 'send');
      const command = simpleCommand(get('/path/subPath'));
      vi.spyOn(command, 'transformCommandOutput').mockReturnValue('transformed response');

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 200, body: 'body' })
        .thenCall(() => client.send(command));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(await spy.mock.results[0].value).toBe('transformed response');
    });

    it('should throw `CcHttpError` when API returns error status', async () => {
      const command = simpleCommand(get('/path/subPath'));

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 500, body: 'A server error occurred' });

      await expectPromiseThrows(client.send(command), (err: CcHttpError) => {
        expect(err).toBeInstanceOf(CcHttpError);
        expect(err.response.status).toBe(500);
        expect(err.response.body).toBe('A server error occurred');
      });
    });

    it('should call `onError` hook when API returns error status', async () => {
      const spy = vi.fn();
      const client = createClient({ hooks: { onError: spy } });
      const command = simpleCommand(get('/path/subPath'));

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({ status: 500, body: 'A server error occurred' });

      await expectPromiseThrows(client.send(command), (err) => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe(err);
      });
    });
  });

  describe('composite command', () => {
    it('should call `_compose` method with right params', async () => {
      const spy = vi.spyOn(client, '_compose');
      const command = compositeCommand('command result');
      const requestConfig = {};

      await client.send(command, requestConfig);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(command);
      expect(spy.mock.calls[0][1]).toBe(requestConfig);
    });

    it('should call `_transformCommandParams` method with right params', async () => {
      const spy = vi.spyOn(client, '_transformCommandParams');
      const command = compositeCommand('command result');
      const requestConfig = {};

      await client.send(command, requestConfig);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(command);
      expect(spy.mock.calls[0][1]).toBe(requestConfig);
    });

    it('should call `command.compose` method with right params', async () => {
      const transformedParams = { transformed: 'params' };
      vi.spyOn(client, '_transformCommandParams').mockReturnValue(Promise.resolve(transformedParams));
      const command = compositeCommand('command result');
      const spy = vi.spyOn(command, 'compose');

      await client.send(command);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(transformedParams);
    });

    it('composer should merge request config with initial request config', async () => {
      const command = new (class MyCommand extends TestCompositeCommand {
        override async compose(
          _params: Parameters<CompositeCommand<'test', unknown, unknown>['compose']>[0],
          composer: Parameters<CompositeCommand<'test', unknown, unknown>['compose']>[1],
        ) {
          void composer.send(simpleCommand(get('/path/subPath')), { cors: true, cache: { ttl: 100 }, timeout: 1000 });
          return 'result';
        }
      })();
      const spy = vi.spyOn(client, 'send');
      await newScenario().when({ method: 'GET', path: '/path/subPath' }).respond({ status: 200, body: 'body' });

      await client.send(command, { cors: false, cache: { mode: 'reload', ttl: 500 }, debug: true });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.lastCall[1]).toEqual({
        cache: { mode: 'reload', ttl: 100 },
        cors: true,
        timeout: 1000,
        debug: true,
      });
    });
  });

  describe('get url', () => {
    it('should call `get` method', async () => {
      const gu = getUrl('example');
      const spy = vi.spyOn(gu, 'get');

      client.getUrl(gu);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should construct the right url', async () => {
      const gu = getUrl('example');

      const url = client.getUrl(gu);

      expect(url.toString()).toBe(`${newScenario.mockClient.baseUrl}/example`);
    });

    it('should construct the right url with auth', async () => {
      const gu = getUrl('example');
      const auth = new CcAuth();
      const spy = vi.spyOn(auth, 'applyOnUrl');
      spy.mockImplementation((url: URL) => url.searchParams.set('auth', 'token'));
      const client = createClient({}, auth);

      const url = client.getUrl(gu);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(url.toString()).toBe(`${newScenario.mockClient.baseUrl}/example?auth=token`);
    });
  });

  describe('stream', () => {
    it('should call `_transformStreamParams` method with right params', async () => {
      client = createClient({
        defaultRequestConfig: {
          cors: false,
          timeout: 10,
        },
      });
      const spy = vi.spyOn(client, '_transformStreamParams');
      const command = streamCommand({ url: '/path/subPath' });

      await client.stream(command, {
        debug: true,
        cors: true,
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(command);
      expect(spy.mock.calls[0][1].debug).toBe(true);
      expect(spy.mock.calls[0][1].cors).toBe(true);
    });

    it('should call `createStream` method with right params', async () => {
      client = createClient({
        defaultRequestConfig: {
          cors: true,
          timeout: 10,
        },
        defaultStreamConfig: {
          healthcheckInterval: 10,
          retry: {
            backoffFactor: 10,
            maxRetryCount: 10,
          },
        },
      });
      const command = streamCommand({ url: '/path/subPath' });
      const spy = vi.spyOn(command, 'createStream');

      await client.stream(command, {
        debug: true,
        cors: false,
        retry: { maxRetryCount: 100 },
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][1].retry.maxRetryCount).toBe(100); // command config
      expect(spy.mock.calls[0][1].retry.backoffFactor).toBe(10); // client config
      expect(spy.mock.calls[0][1].retry.initRetryTimeout).toBe(1_000); // default config
      expect(spy.mock.calls[0][1].debug).toBe(true); // command config
      expect(spy.mock.calls[0][1].healthcheckInterval).toBe(10); // client config
      expect(spy.mock.calls[0][1].heartbeatPeriod).toBe(2_500); // default config
    });

    it('should call `command.toRequestParams` method with right params', async () => {
      vi.spyOn(client, '_transformStreamParams').mockReturnValue(Promise.resolve({ param: 'param' }));
      const command = streamCommand({ url: '/path/subPath' });
      const spy = vi.spyOn(command, 'toRequestParams');

      const stream = await client.stream(command);
      expect(spy).toHaveBeenCalledTimes(0);

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({
          status: 200,
          events: [{ type: 'message', event: 'END_OF_STREAM', data: '{"endedBy": "UNTIL_REACHED"}' }],
        })
        .thenCall(() => startStream(stream));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toEqual({ param: 'param' });
    });

    it('should call `_prepareRequest` method with right params', async () => {
      const command = streamCommand({ url: '/path/subPath' });
      const spy = vi.spyOn(client, '_prepareRequest');

      const stream = await client.stream(command, {
        debug: true,
        cors: false,
      });

      await newScenario()
        .when({ method: 'GET', path: '/path/subPath' })
        .respond({
          status: 200,
          events: [{ type: 'message', event: 'END_OF_STREAM', data: '{"endedBy": "UNTIL_REACHED"}' }],
        })
        .thenCall(() => startStream(stream));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toEqual({
        url: '/path/subPath',
      });
      expect(spy.mock.calls[0][1]).toEqual({
        debug: true,
        cors: false,
      });
    });
  });

  //------------------

  it('should send request with the right method and path', async () => {
    const command = simpleCommand(get('/path/subPath'));

    await newScenario()
      .when({ method: 'GET', path: '/path/subPath' })
      .respond({ status: 200 })
      .thenCall(() => client.send(command));
  });

  it('should send request with the right accept header', async () => {
    const command = simpleCommand(get('/'));

    await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({ status: 200 })
      .thenCall(() => client.send(command))
      .verify((calls) => {
        expect(calls.count).toBe(1);
        expect(calls.first.headers.accept).toBe('application/json');
      });
  });

  it('should send request with the right content-type header', async () => {
    const command = simpleCommand(post('/', 'hello world'));

    await newScenario()
      .when({ method: 'POST', path: '/' })
      .respond({ status: 200 })
      .thenCall(() => client.send(command))
      .verify((calls) => {
        expect(calls.count).toBe(1);
        expect(calls.first.headers['content-type']).toBe('text/plain');
      });
  });

  it('should send request with the right query params', async () => {
    const command = simpleCommand(get('/', new QueryParams({ foo: ['bar1', 'bar2'], bar: 'foo' })));

    await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({ status: 200 })
      .thenCall(() => client.send(command))
      .verify((calls) => {
        expect(calls.count).toBe(1);
        expect(calls.first.queryParams).toEqual({ foo: ['bar1', 'bar2'], bar: 'foo' });
      });
  });

  it('should send request with the right plain text body', async () => {
    const command = simpleCommand(post('/', 'hello world'));

    await newScenario()
      .when({ method: 'POST', path: '/' })
      .respond({ status: 200 })
      .thenCall(() => client.send(command))
      .verify((calls) => {
        expect(calls.count).toBe(1);
        expect(calls.first.body).toBe('hello world');
      });
  });

  it('should send request with the right json body', async () => {
    const command = simpleCommand(post('/', { hello: 'world' }));

    await newScenario()
      .when({ method: 'POST', path: '/' })
      .respond({ status: 200 })
      .thenCall(() => client.send(command))
      .verify((calls) => {
        expect(calls.count).toBe(1);
        expect(calls.first.body).toEqual({ hello: 'world' });
      });
  });

  it('should send request with the right json body already stringified', async () => {
    const command = simpleCommand({
      method: 'POST',
      url: '/',
      headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
      body: '{"hello":"world"}',
    });

    await newScenario()
      .when({ method: 'POST', path: '/' })
      .respond({ status: 200 })
      .thenCall(() => client.send(command))
      .verify((calls) => {
        expect(calls.count).toBe(1);
        expect(calls.first.body).toEqual('{"hello":"world"}');
      });
  });

  // response

  it('should get response with right text plain body', async () => {
    const command = simpleCommand({
      method: 'GET',
      url: '/',
      headers: new HeadersBuilder().acceptTextPlain().build(),
    });

    const response: unknown = await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({ status: 200, body: 'Hello' })
      .thenCall(() => client.send(command));
    expect(response).toBe('Hello');
  });

  it('should get response with right json body', async () => {
    const command = simpleCommand(get('/'));

    const response: unknown = await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({ status: 200, body: { hello: 'world' } })
      .thenCall(() => client.send(command));
    expect(response).toEqual({ hello: 'world' });
  });

  it('should get response with right empty body', async () => {
    const command = simpleCommand(get('/'));

    const response: unknown = await newScenario()
      .when({ method: 'GET', path: '/' })
      .respond({ status: 200, body: null })
      .thenCall(() => client.send(command));
    expect(response).toEqual(null);
  });
});
