import { expect } from '@esm-bundle/chai';

import { CcClient } from '../../src/lib/cc-client.js';
import { SimpleCommand } from '../../src/lib/command/command.js';
import { HeadersBuilder } from '../../src/lib/request/headers-builder.js';
import { QueryParams } from '../../src/lib/request/query-params.js';
import { get, post } from '../../src/lib/request/request-params-builder.js';
import { TestServer } from '../lib/test-server.js';

/**
 * @typedef {import('../../src/types/request.types.d.ts').CcRequestParams} CcRequestParams
 */

/**
 * @extends {SimpleCommand<'test', any, any>}
 * @abstract
 */
export class TestSimpleCommand extends SimpleCommand {}

/**
 * @param {Partial<CcRequestParams>} requestsParams
 * @returns {TestSimpleCommand}
 */
function simpleCommand(requestsParams) {
  return new (class MyCommand extends TestSimpleCommand {
    toRequestParams() {
      return requestsParams;
    }
  })();
}

describe('clever-client', () => {
  const testServer = new TestServer();

  before(async () => {
    testServer.stop();
    await testServer.start();
  });

  after(async () => {
    testServer.stop();
  });

  beforeEach(async () => {
    testServer.spy.reset();
  });

  describe('with fetch', () => {
    /** @type {CcClient<'test'>} */
    let client;

    beforeEach(async () => {
      client = new CcClient({ baseUrl: testServer.getUrl() });
    });

    // request

    it('should send request with the right method', async () => {
      const command = simpleCommand(get('/'));

      await client.send(command);

      expect(testServer.spy.callCount).to.eq(1);
      expect(testServer.spy.firstCall.args[0].method).to.eq('GET');
    });

    it('should send request with the right path', async () => {
      const command = simpleCommand(get('/path/subPath'));

      await client.send(command);

      expect(testServer.spy.callCount).to.eq(1);
      expect(testServer.spy.firstCall.args[0].path).to.eq('/path/subPath');
    });

    it('should send request with the right accept header', async () => {
      const command = simpleCommand(get('/path/subPath'));

      await client.send(command);

      expect(testServer.spy.callCount).to.eq(1);
      expect(testServer.spy.firstCall.args[0].headers.accept).to.eq('application/json');
    });

    it('should send request with the right content-type header', async () => {
      const command = simpleCommand(post('/path/subPath', 'hello world'));

      await client.send(command);

      expect(testServer.spy.callCount).to.eq(1);
      expect(testServer.spy.firstCall.args[0].headers['content-type']).to.eq('text/plain');
    });

    it('should send request with the right query params', async () => {
      const command = simpleCommand(get('/', new QueryParams({ foo: ['bar1', 'bar2'], bar: 'foo' })));

      await client.send(command);

      expect(testServer.spy.callCount).to.eq(1);
      expect(testServer.spy.firstCall.args[0].path).to.eq('/?foo=bar1&foo=bar2&bar=foo');
    });

    it('should send request with the right plain text body', async () => {
      const command = simpleCommand(post('/', 'hello world'));

      await client.send(command);

      expect(testServer.spy.callCount).to.eq(1);
      expect(testServer.spy.firstCall.args[0].body).to.eq('hello world');
    });

    it('should send request with the right json body', async () => {
      const command = simpleCommand(post('/', { hello: 'world' }));

      await client.send(command);

      expect(testServer.spy.callCount).to.eq(1);
      expect(testServer.spy.firstCall.args[0].body).to.eq('{"hello":"world"}');
    });

    it('should send request with the right json body already stringified', async () => {
      const command = simpleCommand({
        method: 'POST',
        url: '/',
        headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
        body: '{"hello":"world"}',
      });

      await client.send(command);

      expect(testServer.spy.callCount).to.eq(1);
      expect(testServer.spy.firstCall.args[0].body).to.eq('{"hello":"world"}');
    });

    // response

    it('should get response with right text plain body', async () => {
      testServer.setHandler((_req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello');
      });
      const command = simpleCommand({
        method: 'GET',
        url: '/',
        headers: new HeadersBuilder().acceptTextPlain().build(),
      });

      const response = await client.send(command);

      expect(response).to.equal('Hello');
    });

    it('should get response with right json body', async () => {
      testServer.setHandler((_req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"hello": "world"}');
      });
      const command = simpleCommand(get('/'));

      const response = await client.send(command);

      expect(response).to.deep.eq({ hello: 'world' });
    });

    it('should get response with right empty body', async () => {
      testServer.setHandler((_req, res) => {
        res.writeHead(204);
        res.end();
      });
      const command = simpleCommand(get('/'));

      const response = await client.send(command);

      expect(response).to.deep.eq(null);
    });

    // request wrapper plugin

    // it('should apply wrapper plugins properly', async () => {
    //   // prepare
    //   const spy = hanbi.spy();
    //
    //   /**
    //    * @param {number} i
    //    * @returns {WrapperPlugin}
    //    */
    //   function requestWrapperPlugin(i) {
    //     return {
    //       type: 'requestWrapper',
    //       async handle(requestParams, handler) {
    //         spy.handler(`before ${i}`);
    //         const result = await handler(requestParams);
    //         spy.handler(`after ${i}`);
    //         return result;
    //       },
    //     };
    //   }
    //
    //   client
    //     .register(requestWrapperPlugin(0))
    //     .register(requestWrapperPlugin(1))
    //     .register(requestWrapperPlugin(2))
    //     .register(requestWrapperPlugin(3));
    //
    //   class MyCommand extends Command {
    //     toRequestParams() {
    //       return {
    //         method: 'GET',
    //         url: '/',
    //         headers: new Headers({ Accept: 'application/json' }),
    //       };
    //     }
    //   }
    //
    //   // action
    //   await client.send(command);
    //
    //   // assert
    //   expect(spy.callCount).to.eq(8);
    //   expect(Array.from(spy.calls.values()).flatMap((e) => e.args)).to.deep.eq([
    //     'before 0',
    //     'before 1',
    //     'before 2',
    //     'before 3',
    //     'after 3',
    //     'after 2',
    //     'after 1',
    //     'after 0',
    //   ]);
    // });

    // errors

    it.skip('should receive right error', async () => {
      testServer.setHandler((_req, res) => {
        res.writeHead(211);
        res.end();
      });
      const client = new CcClient({ baseUrl: 'http://oups' });
      const command = simpleCommand(get('/'));

      const response = await client.send(command);

      expect(response.status).to.deep.eq(211);
    });
  });
});
