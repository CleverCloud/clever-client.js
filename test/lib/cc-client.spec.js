/**
 * @import { CcRequestParams } from '../../src/types/request.types.js'
 * @import { MockCtrl } from '../test-lib/mock-api/mock-ctrl.js'
 */
import { expect } from 'chai';
import { CcClient } from '../../src/lib/cc-client.js';
import { SimpleCommand } from '../../src/lib/command/command.js';
import { HeadersBuilder } from '../../src/lib/request/headers-builder.js';
import { QueryParams } from '../../src/lib/request/query-params.js';
import { get, post } from '../../src/lib/request/request-params-builder.js';
import { mockTestHooks } from '../test-lib/mock-api/support/mock-test-hooks.js';

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
  /** @type {CcClient<'test'>} */
  let client;
  /** @type {MockCtrl} */
  let mockCtrl;

  const hooks = mockTestHooks();

  before(async () => {
    mockCtrl = await hooks.before();
    client = new CcClient({ baseUrl: mockCtrl.mockClient.baseUrl });
  });
  beforeEach(hooks.beforeEach);
  after(hooks.after);

  describe('with fetch', () => {
    // request

    it('should send request with the right method and path', async () => {
      const command = simpleCommand(get('/path/subPath'));

      await mockCtrl
        .mock()
        .when('GET', '/path/subPath')
        .return(200)
        .then(() => client.send(command))
        .expectCallsCount(1);
    });

    it('should send request with the right accept header', async () => {
      const command = simpleCommand(get('/'));

      await mockCtrl
        .mock()
        .when('GET', '/')
        .return(200)
        .then(() => client.send(command))
        .expectCallsCount(1)
        .verify((calls) => {
          expect(calls[0].headers.accept).to.eq('application/json');
        });
    });

    it('should send request with the right content-type header', async () => {
      const command = simpleCommand(post('/', 'hello world'));

      await mockCtrl
        .mock()
        .when('POST', '/')
        .return(200)
        .then(() => client.send(command))
        .expectCallsCount(1)
        .verify((calls) => {
          expect(calls[0].headers['content-type']).to.eq('text/plain');
        });
    });

    it('should send request with the right query params', async () => {
      const command = simpleCommand(get('/', new QueryParams({ foo: ['bar1', 'bar2'], bar: 'foo' })));

      await mockCtrl
        .mock()
        .when('GET', '/')
        .return(200)
        .then(() => client.send(command))
        .expectCallsCount(1)
        .verify((calls) => {
          expect(calls[0].queryParams).to.deep.eq({ foo: ['bar1', 'bar2'], bar: 'foo' });
        });
    });

    it('should send request with the right plain text body', async () => {
      const command = simpleCommand(post('/', 'hello world'));

      await mockCtrl
        .mock()
        .when('POST', '/')
        .return(200)
        .then(() => client.send(command))
        .expectCallsCount(1)
        .verify((calls) => {
          expect(calls[0].body).to.eq('hello world');
        });
    });

    it('should send request with the right json body', async () => {
      const command = simpleCommand(post('/', { hello: 'world' }));

      await mockCtrl
        .mock()
        .when('POST', '/')
        .return(200)
        .then(() => client.send(command))
        .expectCallsCount(1)
        .verify((calls) => {
          expect(calls[0].body).to.deep.eq({ hello: 'world' });
        });
    });

    it('should send request with the right json body already stringified', async () => {
      const command = simpleCommand({
        method: 'POST',
        url: '/',
        headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
        body: '{"hello":"world"}',
      });

      await mockCtrl
        .mock()
        .when('POST', '/')
        .return(200)
        .then(() => client.send(command))
        .expectCallsCount(1)
        .verify((calls) => {
          expect(calls[0].body).to.deep.eq({ hello: 'world' });
        });
    });

    // response

    it('should get response with right text plain body', async () => {
      const command = simpleCommand({
        method: 'GET',
        url: '/',
        headers: new HeadersBuilder().acceptTextPlain().build(),
      });

      const response = await mockCtrl
        .mock()
        .when('GET', '/')
        .return(200, 'Hello')
        .then(() => client.send(command))
        .expectCallsCount(1);

      expect(response).to.equal('Hello');
    });

    it('should get response with right json body', async () => {
      const command = simpleCommand(get('/'));

      const response = await mockCtrl
        .mock()
        .when('GET', '/')
        .return(200, { hello: 'world' })
        .then(() => client.send(command))
        .expectCallsCount(1);

      expect(response).to.deep.eq({ hello: 'world' });
    });

    it('should get response with right empty body', async () => {
      const command = simpleCommand(get('/'));

      const response = await mockCtrl
        .mock()
        .when('GET', '/')
        .return(200, null)
        .then(() => client.send(command))
        .expectCallsCount(1);

      expect(response).to.deep.eq(null);
    });
  });
});
