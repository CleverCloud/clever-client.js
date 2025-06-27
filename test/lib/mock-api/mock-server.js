import fastifyCors from '@fastify/cors';
import Fastify from 'fastify';
import { findFreePorts } from 'find-free-ports';
import { createRequestKey, normalizePath } from './mock-utils.js';

/**
 * @import {Mock, MockCall, MockRequest, OneOrMany} from './mock-api.types.js';
 */

export async function startServer() {
  //-- create internal model ------

  const model = new Model();

  //-- admin server ------

  const adminServer = Fastify();
  adminServer.register(fastifyCors, {
    origin: true,
  });
  adminServer.register(async (fastify) => {
    fastify.post('/reset', async (_request, reply) => {
      model.reset();
      reply.code(204).send();
    });
    fastify.post('/mock', async (request, reply) => {
      const body = request.body;
      // todo: validate body
      model.addMock(/** @type {Mock} */ (body));
      reply.code(200).send({ result: 'ok' });
    });
    fastify.post('/calls', async (request, reply) => {
      const body = request.body;
      // todo: validate body
      const calls = model.getCalls(/** @type {MockRequest} */ (body)) ?? [];
      reply.code(200).send(calls);
    });
  });
  adminServer.setNotFoundHandler((_request, reply) => {
    reply.code(404).send();
  });
  adminServer.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    const statusCode = error.statusCode ?? 500;
    const code = error.code ?? 'unknown';
    const message = error.message ?? 'Unknown error';
    reply.status(statusCode).send({ code, message });
  });

  //-- mock server ------

  const mockServer = Fastify();
  mockServer.register(fastifyCors, {
    origin: true,
  });
  mockServer.register(async (fastify) => {
    fastify.route({
      method: ['GET', 'HEAD', 'TRACE', 'DELETE', 'PATCH', 'PUT', 'POST'],
      url: '*',
      handler: async (request, reply) => {
        const call = model.registerCall(request.method, request.url, request.headers, request.body);

        const mock = model.getMock(request.method, request.url);
        if (mock == null) {
          reply.code(404).send();
        } else {
          if (mock.throttle != null && mock.throttle > 0) {
            await new Promise((resolve) => setTimeout(resolve, mock.throttle));
          }
          call.response = mock.response;
          reply.code(mock.response.status).send(mock.response.body);
        }
      },
    });
  });

  //-- start servers ------

  const [adminPort, mockPort] = await findFreePorts(2, { startPort: 3000 });
  await adminServer.listen({ port: adminPort, host: '0.0.0.0' });
  await mockServer.listen({ port: mockPort, host: '0.0.0.0' });
  return {
    adminPort,
    mockPort,
    stop: () => {
      return Promise.allSettled([adminServer.close(), mockServer.close()]);
    },
  };
}

class Model {
  /**
   * @type {Map<string, Mock>}
   */
  #mocks = new Map();

  /**
   * @type {Map<any, any>}
   */
  #calls = new Map();

  constructor() {}

  /**
   * @param {Mock} mock
   */
  addMock(mock) {
    this.#mocks.set(createRequestKey(mock.request), mock);
  }

  /**
   * @param {string} method
   * @param {string} path
   * @returns {Mock}
   */
  getMock(method, path) {
    return this.#mocks.get(createRequestKey({ method, path }));
  }

  /**
   * @param {string} method
   * @param {string} path
   * @param {Record<string, OneOrMany<string>>} headers
   * @param {any} body
   * @return {MockCall}
   */
  registerCall(method, path, headers, body) {
    const normalizedPath = normalizePath(path);

    const call = {
      method,
      path: normalizedPath.pathname,
      queryParams: normalizedPath.queryParams,
      headers,
      body,
    };
    const callKey = createRequestKey({ method, path });

    const calls = this.#calls.get(callKey);
    if (calls == null) {
      this.#calls.set(callKey, [call]);
    } else {
      calls.push(call);
    }

    return call;
  }

  /**
   * @param {MockRequest} request
   * @returns {Array<MockCall>}
   */
  getCalls(request) {
    const callKey = createRequestKey(request);
    return this.#calls.get(callKey);
  }

  reset() {
    this.#mocks.clear();
    this.resetCalls();
  }

  resetCalls() {
    this.#calls.clear();
  }
}
