/**
 * A client of its own and its commands, written the way an application outside this repository writes
 * them: with nothing but what `@clevercloud/client/cc-client.js` and `@clevercloud/client/utils/*.js`
 * expose. An import reaching deeper than `src/lib/index.js` would mean the public surface is missing
 * something, so this file must not have one.
 */
import type { NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import packageJson from '../../../package.json' with { type: 'json' };
import {
  CcAuth,
  CcClient,
  type CcClientHooks,
  type CcRequestParams,
  CcStream,
  type CcStreamConfig,
  type CcStreamRequestFactory,
  type Composer,
  CompositeCommand,
  get,
  HeadersBuilder,
  postJson,
  QueryParams,
  safeUrl,
  SimpleCommand,
  StreamCommand,
} from '../../../src/lib/index.ts';
import { isCcHttpError, isCcHttpErrorWithStatus } from '../../../src/utils/error-utils.ts';
import { expectPromiseThrows } from '../../lib/expect-utils.ts';

//-- the client and its commands, as an application would write them

type MyApi = 'my-api';

interface MyApiClientConfig {
  baseUrl: string;
  onUnauthorized: () => void;
}

class MyApiClient extends CcClient<MyApi> {
  constructor(config: MyApiClientConfig) {
    const hooks: CcClientHooks = {
      onRequest: (requestParams) => {
        requestParams.headers.set('X-Requested-By', 'my-app');
      },
      onError: (error) => {
        if (isCcHttpErrorWithStatus(error, 401)) {
          config.onUnauthorized();
        }
      },
    };
    super({ baseUrl: config.baseUrl, hooks });
  }
}

abstract class MyApiCommand<CommandInput, CommandOutput> extends SimpleCommand<MyApi, CommandInput, CommandOutput> {
  get api(): MyApi {
    return 'my-api';
  }
}

interface Widget {
  id: string;
  name: string;
}

class GetWidgetCommand extends MyApiCommand<{ widgetId: string; expand?: boolean }, Widget> {
  toRequestParams(params: { widgetId: string; expand?: boolean }): Partial<CcRequestParams> {
    return get(safeUrl`/widgets/${params.widgetId}`, new QueryParams({ expand: params.expand }));
  }

  override transformCommandOutput(response: unknown): Widget {
    const payload = response as { widget_id: string; widget_name: string };
    return { id: payload.widget_id, name: payload.widget_name };
  }

  override isIdempotent(): boolean {
    return true;
  }
}

class CreateWidgetCommand extends MyApiCommand<{ name: string }, Widget> {
  toRequestParams(params: { name: string }): Partial<CcRequestParams> {
    return postJson('/widgets', { widget_name: params.name });
  }

  override transformCommandOutput(response: unknown): Widget {
    const payload = response as { widget_id: string; widget_name: string };
    return { id: payload.widget_id, name: payload.widget_name };
  }
}

class CreateAndGetWidgetCommand extends CompositeCommand<MyApi, { name: string }, Widget> {
  get api(): MyApi {
    return 'my-api';
  }

  async compose(params: { name: string }, composer: Composer<MyApi>): Promise<Widget> {
    const created = await composer.send(new CreateWidgetCommand(params));
    return composer.send(new GetWidgetCommand({ widgetId: created.id }));
  }
}

class WidgetEventsStream extends CcStream {
  onWidgetEvent(callback: (widget: Widget) => void): this {
    return this.on<string>('WIDGET', (event) => {
      callback(JSON.parse(event.data) as Widget);
    });
  }
}

class StreamWidgetEventsCommand extends StreamCommand<MyApi, { widgetId: string }, WidgetEventsStream> {
  get api(): MyApi {
    return 'my-api';
  }

  toRequestParams(params: { widgetId: string }): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/widgets/${params.widgetId}/events`,
      headers: new HeadersBuilder().acceptEventStream().build(),
    };
  }

  createStream(requestFactory: CcStreamRequestFactory, config: CcStreamConfig): WidgetEventsStream {
    return new WidgetEventsStream(requestFactory, config);
  }
}

class CcAuthCookie extends CcAuth {
  getAuthorization(): string {
    return 'Session my-session';
  }
}

//--

describe('a client written with the public entry points only', () => {
  let newScenario: NewScenario;
  const hooks = doublureHooks();

  function createClient(onUnauthorized = vi.fn()): MyApiClient {
    return new MyApiClient({ baseUrl: `${newScenario.mockClient.baseUrl}/my-api`, onUnauthorized });
  }

  beforeAll(async () => {
    newScenario = await hooks.before();
  });
  beforeEach(hooks.beforeEach);
  afterAll(hooks.after);

  it('should be published under `@clevercloud/client/cc-client.js`', () => {
    expect(packageJson.exports['./cc-client.js']).toEqual({
      types: './dist/src/lib/index.d.ts',
      default: './dist/src/lib/index.js',
    });
  });

  it('should send a simple command under the base URL, with the header the `onRequest` hook adds', async () => {
    const client = createClient();

    await newScenario()
      .when({ method: 'GET', path: '/my-api/widgets/w1' })
      .respond({ status: 200, body: { widget_id: 'w1', widget_name: 'Widget' } })
      .thenCall(() => client.send(new GetWidgetCommand({ widgetId: 'w1', expand: true })))
      .verify((calls) => {
        expect(calls.count).toBe(1);
        expect(calls.first.headers['x-requested-by']).toBe('my-app');
        expect(calls.first.headers.authorization).toBeUndefined();
        expect(calls.first.queryParams.expand).toBe('true');
      });
  });

  it('should return the output the command transforms the response into', async () => {
    const client = createClient();

    await newScenario()
      .when({ method: 'GET', path: '/my-api/widgets/w1' })
      .respond({ status: 200, body: { widget_id: 'w1', widget_name: 'Widget' } });

    expect(await client.send(new GetWidgetCommand({ widgetId: 'w1' }))).toEqual({ id: 'w1', name: 'Widget' });
  });

  it('should send the sub-commands of a composite command', async () => {
    const client = createClient();

    await newScenario()
      .when({ method: 'POST', path: '/my-api/widgets' })
      .respond({ status: 201, body: { widget_id: 'w1', widget_name: 'Widget' } })
      .when({ method: 'GET', path: '/my-api/widgets/w1' })
      .respond({ status: 200, body: { widget_id: 'w1', widget_name: 'Widget' } });

    expect(await client.send(new CreateAndGetWidgetCommand({ name: 'Widget' }))).toEqual({ id: 'w1', name: 'Widget' });
  });

  it('should call the `onError` hook with an error the `utils/error-utils.js` predicates narrow', async () => {
    const onUnauthorized = vi.fn();
    const client = createClient(onUnauthorized);

    await newScenario()
      .when({ method: 'GET', path: '/my-api/widgets/w1' })
      .respond({ status: 401, body: { id: 401, message: 'Not connected' } });

    await expectPromiseThrows(client.send(new GetWidgetCommand({ widgetId: 'w1' })), (err) => {
      expect(isCcHttpError(err)).toBe(true);
      expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });
  });

  it('should abort a request through the `signal` it is sent with, without calling the `onError` hook', async () => {
    const onUnauthorized = vi.fn();
    const client = createClient(onUnauthorized);
    const abortController = new AbortController();

    await newScenario()
      .when({ method: 'GET', path: '/my-api/widgets/w1' })
      .respond({ status: 401, body: { id: 401, message: 'Not connected' } }, 50);

    const promise = client.send(new GetWidgetCommand({ widgetId: 'w1' }), { signal: abortController.signal });
    setTimeout(() => abortController.abort(), 10);

    await expectPromiseThrows(promise, (err) => {
      expect(err).toBe(abortController.signal.reason);
      expect(onUnauthorized).not.toHaveBeenCalled();
    });
  });

  it('should apply a custom authentication', async () => {
    const client = new CcClient<MyApi>({ baseUrl: `${newScenario.mockClient.baseUrl}/my-api` }, new CcAuthCookie());

    await newScenario()
      .when({ method: 'GET', path: '/my-api/widgets/w1' })
      .respond({ status: 200, body: { widget_id: 'w1', widget_name: 'Widget' } })
      .thenCall(() => client.send(new GetWidgetCommand({ widgetId: 'w1' })))
      .verify((calls) => {
        expect(calls.first.headers.authorization).toBe('Session my-session');
      });
  });

  it('should open a stream and hand its events over', async () => {
    const client = createClient();
    const widgets: Array<Widget> = [];

    await newScenario()
      .when({ method: 'GET', path: '/my-api/widgets/w1/events' })
      .respond({
        status: 200,
        events: [
          { type: 'message', event: 'WIDGET', data: { id: 'w1', name: 'Widget' } },
          { type: 'message', event: 'END_OF_STREAM', data: { endedBy: 'UNTIL_REACHED' } },
        ],
        delayBetween: 10,
      })
      .thenCall(async () => {
        const stream = await client.stream(new StreamWidgetEventsCommand({ widgetId: 'w1' }));
        stream.onWidgetEvent((widget) => widgets.push(widget));
        return stream.start();
      })
      .verify((calls) => {
        expect(calls.first.headers['x-requested-by']).toBe('my-app');
        expect(calls.first.headers.accept).toBe('text/event-stream');
      });

    expect(widgets).toEqual([{ id: 'w1', name: 'Widget' }]);
  });

  it.runIf(globalThis.location != null)('should accept a base URL relative to the page', () => {
    expect(() => new MyApiClient({ baseUrl: '/my-api', onUnauthorized: vi.fn() })).not.toThrow();
  });
});
