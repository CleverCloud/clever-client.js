import { expect } from 'chai';
import { findFreePorts } from 'find-free-ports';
import * as hanbi from 'hanbi';
import http from 'http';
import { CcClient } from '../src/lib/cc-client.js';
import { AbstractCommand } from '../src/lib/command/abstract-command.js';
import { QueryParams } from '../src/lib/request/query-params.js';

class MockServer {
  /** @type {number} */
  #port;
  /** @type {function} */
  #stopServer;
  /** @type {http.RequestListener} */
  #handler = (_req, res) => {
    res.writeHead(204);
    res.end();
  };

  constructor() {
    this.spy = hanbi.spy();
  }

  async start() {
    const server = http.createServer((req, res) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        this.spy.handler({
          path: req.url,
          method: req.method,
          headers: req.headers,
          body,
        });
        this.#handler?.(req, res);
      });
    });
    /** @type {(url: string) => void} */
    let internalResolve;
    const promise = new Promise((resolve) => {
      internalResolve = resolve;
    });

    this.#port = (await findFreePorts(1, { startPort: 8000 }))[0];

    console.log('Starting server...');
    server.listen(this.#port, () => {
      console.log(`Server started. Listening on port ${this.#port}`);
      this.#stopServer = () => {
        console.log('Stopping server...');
        server.close(() => {
          console.log('Server stopped.');
        });
      };
      internalResolve(this.getUrl());
    });

    return promise;
  }

  getUrl() {
    return `http://localhost:${this.#port}`;
  }

  /**
   * @param {http.RequestListener} handler
   */
  setHandler(handler) {
    this.#handler = handler;
  }

  stop() {
    this.#stopServer?.();
  }
}

describe('clever-client', () => {
  const mockServer = new MockServer();

  before(async () => {
    mockServer.stop();
    await mockServer.start();
  });

  after(async () => {
    mockServer.stop();
  });

  beforeEach(async () => {
    mockServer.spy.reset();
  });

  describe('with fetch', () => {
    /** @type {CcClient} */
    let client;

    beforeEach(async () => {
      client = new CcClient({ baseUrl: mockServer.getUrl() });
    });

    // request

    it('should send request with the right method', async () => {
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/',
            headers: new Headers({ Accept: 'application/json' }),
          };
        }
      }

      await client.send(new MyCommand());

      expect(mockServer.spy.callCount).to.eq(1);
      expect(mockServer.spy.firstCall.args[0].method).to.eq('GET');
    });

    it('should send request with the right path', async () => {
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/path/subPath',
            headers: new Headers({ Accept: 'application/json' }),
          };
        }
      }

      await client.send(new MyCommand());

      expect(mockServer.spy.callCount).to.eq(1);
      expect(mockServer.spy.firstCall.args[0].path).to.eq('/path/subPath');
    });

    it('should send request with the right accept header', async () => {
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/path/subPath',
            headers: new Headers({ Accept: 'application/json' }),
          };
        }
      }

      await client.send(new MyCommand());

      expect(mockServer.spy.callCount).to.eq(1);
      expect(mockServer.spy.firstCall.args[0].headers.accept).to.eq('application/json');
    });

    it('should send request with the right content-type header', async () => {
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/',
            headers: new Headers({
              Accept: 'application/json',
              'Content-Type': 'text/plain',
            }),
          };
        }
      }

      await client.send(new MyCommand());

      expect(mockServer.spy.callCount).to.eq(1);
      expect(mockServer.spy.firstCall.args[0].headers['content-type']).to.eq('text/plain');
    });

    it('should send request with the right query params', async () => {
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/',
            queryParams: new QueryParams({ foo: ['bar1', 'bar2'], bar: 'foo' }),
            headers: new Headers({
              Accept: 'application/json',
              'Content-Type': 'text/plain',
            }),
          };
        }
      }

      await client.send(new MyCommand());

      expect(mockServer.spy.callCount).to.eq(1);
      expect(mockServer.spy.firstCall.args[0].path).to.eq('/?foo=bar1&foo=bar2&bar=foo');
    });

    it('should send request with the right plain text body', async () => {
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'POST',
            url: '/',
            headers: new Headers({
              Accept: 'application/json',
              'Content-Type': 'plain/text',
            }),
            body: 'hello world',
          };
        }
      }

      await client.send(new MyCommand());

      expect(mockServer.spy.callCount).to.eq(1);
      expect(mockServer.spy.firstCall.args[0].body).to.eq('hello world');
    });

    it('should send request with the right json body', async () => {
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'POST',
            url: '/',
            headers: new Headers({
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }),
            body: { hello: 'world' },
          };
        }
      }

      await client.send(new MyCommand());

      expect(mockServer.spy.callCount).to.eq(1);
      expect(mockServer.spy.firstCall.args[0].body).to.eq('{"hello":"world"}');
    });

    it('should send request with the right json body already stringified', async () => {
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'POST',
            url: '/',
            headers: new Headers({
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }),
            body: '{"hello":"world"}',
          };
        }
      }

      await client.send(new MyCommand());

      expect(mockServer.spy.callCount).to.eq(1);
      expect(mockServer.spy.firstCall.args[0].body).to.eq('{"hello":"world"}');
    });

    // response

    it('should get response with right status code', async () => {
      mockServer.setHandler((_req, res) => {
        res.writeHead(211);
        res.end();
      });
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/',
            headers: new Headers({ Accept: 'application/json' }),
          };
        }
      }

      const response = await client.send(new MyCommand());

      expect(response.status).to.deep.eq(211);
    });

    it('should get response with right text plain body', async () => {
      mockServer.setHandler((_req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello');
      });

      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/',
            headers: new Headers({ Accept: 'text/plain' }),
          };
        }
      }

      const response = await client.send(new MyCommand());
      const body = await response.body;

      expect(body).to.equal('Hello');
    });

    it('should get response with right json body', async () => {
      mockServer.setHandler((_req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"hello": "world"}');
      });

      /** @extends {AbstractCommand<{ hello: string }>} */
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/',
            headers: new Headers({ Accept: 'application/json' }),
          };
        }
      }

      // const response = await client.run(new MyCommand('coucou'));
      const response = await client.send(new MyCommand());
      const body = await response.body;

      expect(body).to.deep.eq({ hello: 'world' });
    });

    it('should get response with right empty body', async () => {
      mockServer.setHandler((_req, res) => {
        res.writeHead(204);
        res.end();
      });

      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/',
            headers: new Headers({ Accept: 'application/json' }),
          };
        }
      }

      const response = await client.send(new MyCommand());
      const body = await response.body;

      expect(body).to.deep.eq(null);
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
    //   class MyCommand extends AbstractCommand {
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
    //   await client.send(new MyCommand());
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
      mockServer.setHandler((_req, res) => {
        res.writeHead(211);
        res.end();
      });
      client = new CcClient({ baseUrl: 'http://oups' });
      class MyCommand extends AbstractCommand {
        toRequestParams() {
          return {
            method: 'GET',
            url: '/',
            headers: new Headers({ Accept: 'application/json' }),
          };
        }
      }

      const response = await client.send(new MyCommand());

      expect(response.status).to.deep.eq(211);
    });
  });
});
