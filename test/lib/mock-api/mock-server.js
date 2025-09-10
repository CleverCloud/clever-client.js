import fastifyCors from '@fastify/cors';
import Fastify from 'fastify';
import { findFreePorts } from 'find-free-ports';
import { createRequestKey, normalizePath } from './mock-utils.js';

/**
 * @import {Mock, MockCall, MockRequest, OneOrMany} from './mock-api.types.js';
 */

/**
 * Starts a mock API server with both admin and mock endpoints.
 *
 * The server consists of two parts:
 * - Admin server: Provides endpoints for configuring mocks and retrieving call logs
 * - Mock server: Serves the actual mock API responses based on configured mocks
 *
 * Both servers are started on automatically assigned free ports and support CORS.
 *
 * @returns {Promise<{adminPort: number, mockPort: number, stop: () => Promise<PromiseSettledResult<void>[]>}>}
 *   Server configuration with ports and stop function
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
    fastify.post('/calls', async (_request, reply) => {
      reply.code(200).send(model.getCalls());
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
          call.matchingMockRequest = mock.request;

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

/**
 * Internal data model for managing mock configurations and call logs.
 *
 * This class maintains two key data structures:
 * - Mocks: Maps request patterns to their configured responses
 * - Calls: Records all API calls made to the mock server for verification
 */
class Model {
  /**
   * @type {Map<string, Mock>} Maps normalized request keys to mock configurations
   */
  #mocks = new Map();

  /**
   * @type {Array<MockCall>} Recorded calls
   */
  #calls = [];

  /**
   * Adds a new mock configuration to the server.
   * The mock will be used to respond to requests matching the specified pattern.
   *
   * @param {Mock} mock - The mock configuration to add
   */
  addMock(mock) {
    this.#mocks.set(createRequestKey(mock.request), mock);
  }

  /**
   * Retrieves the mock configuration for a specific request pattern.
   *
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} path - URL path including query parameters
   * @returns {Mock|undefined} The matching mock configuration, or undefined if no match found
   */
  getMock(method, path) {
    return this.#mocks.get(createRequestKey({ method, path }));
  }

  /**
   * Records an API call made to the mock server.
   * This creates a log entry that can be retrieved later for test verification.
   *
   * @param {string} method - HTTP method used in the request
   * @param {string} path - URL path including query parameters
   * @param {Record<string, OneOrMany<string>>} headers - HTTP headers from the request
   * @param {any} body - Request body data
   * @returns {MockCall} The recorded call object
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
    this.#calls.push(call);

    return call;
  }

  /**
   * Retrieves all recorded calls that match a specific request pattern.
   *
   * @returns {Array<MockCall>} Array of matching calls
   */
  getCalls() {
    return this.#calls ?? [];
  }

  /**
   * Resets the entire model, clearing both mocks and call logs.
   * This provides a clean state for new tests.
   */
  reset() {
    this.#mocks.clear();
    this.resetCalls();
  }

  /**
   * Clears only the call logs, keeping mock configurations intact.
   * Useful when you want to verify calls for a specific test phase.
   */
  resetCalls() {
    this.#calls = [];
  }
}
