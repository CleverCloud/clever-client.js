import http from 'http';
import { sleep } from './timers.js';

export class TestSseServer {
  constructor(port) {
    this._alive = false;
    this._port = port;
    this._eventId = 0;
    this._server = http.createServer(async (req, res) => {
      if (this._response == null) {
        this._request = req;
        this._response = res;
        this._request.once('close', () => {
          delete this._request;
          delete this._response;
        });
      } else {
        throw new Error('Already response');
      }
    });
  }

  getUrl() {
    return `http://localhost:${this._port}`;
  }

  async start() {
    this._alive = true;
    this._server.close();
    this._server.listen(this._port);
    await sleep(100);
  }

  async stop() {
    this._alive = false;
    this._server.closeAllConnections();
    this._server.close();
    delete this._request;
    delete this._response;
  }

  async getRequestHeader(header) {
    while (this._request == null && this._alive) {
      await sleep(100);
    }
    return this._request.headers[header];
  }

  async getQueryParam(name) {
    while (this._request == null && this._alive) {
      await sleep(100);
    }
    return new URL(this._request.url, `http://localhost:${this._port}`).searchParams.get(name);
  }

  async handleRequest(status, headers, body) {
    while (this._response == null && this._alive) {
      await sleep(100);
    }
    this._response.writeHead(status, headers);
    this._response.flushHeaders();
    if (body != null) {
      this._response.write(body);
      this._response.end();
    }
  }

  async acceptRequest() {
    return this.handleRequest(200, {
      'content-type': 'text/event-stream',
      'access-control-allow-origin': '*',
    });
  }

  async rejectRequest(status, bodyObject) {
    const headers = bodyObject != null ? { 'content-type': 'application/json' } : {};
    const body = bodyObject != null ? JSON.stringify(bodyObject) : '';
    return this.handleRequest(status, headers, body);
  }

  async acceptRequestWithBadContentType() {
    return this.handleRequest(200, { 'content-type': 'text/plain' }, 'Hello World!');
  }

  async acceptRequestWith400() {
    return this.rejectRequest(400, {
      // eslint-disable-next-line camelcase
      api_request_id: 'request_http_XXX',
      code: 'clever.core.bad-request',
      context: {
        OVDErrorFieldContext: {
          fieldName: 'limit',
          fieldValue: "'a' is not a valid 32-bit signed integer value",
        },
      },
      error: 'The query parameter was malformed.',
    });
  }

  async acceptRequestWith401() {
    return this.rejectRequest(401, {
      // eslint-disable-next-line camelcase
      api_request_id: 'request_http_XXX',
      code: 'clever.auth.unauthorized',
      context: {},
      error: 'Unauthorized to access this resource.',
    });
  }

  async acceptRequestWith404() {
    return this.rejectRequest(404, {
      // eslint-disable-next-line camelcase
      api_request_id: 'request_http_XXX',
      code: 'clever.core.not-found',
      context: {},
      error:
        'Partitioned Topic not found: persistent://orga_540caeb6-521c-4a19-a955-efe6da35d142/logs/app_457bd0d5-23c5-48c3-93bc-881ab5e4492-partition-0 has zero partitions',
    });
  }

  async acceptRequestWith500() {
    return this.rejectRequest(500);
  }

  async sendEvent({ id, event = 'message', data }) {
    while (this._response == null && this._alive) {
      await sleep(100);
    }

    if (id != null) {
      this._response.write(`id:${id}\n`);
    } else {
      this._eventId++;
      this._response.write(`id:${this._eventId}\n`);
    }

    if (event !== 'message') {
      this._response.write(`event:${event}\n`);
    }

    const text = typeof data !== 'string' ? JSON.stringify(data) : data;

    const lines = text.split('\n');
    for (const line of lines) {
      this._response.write(`data:${line}\n`);
    }
    this._response.write('\n');
  }

  async sendHeartbeats(count, delay) {
    for (let i = 0; i < count; i++) {
      await sleep(delay);
      await this.sendEvent({ event: 'HEARTBEAT', data: '' });
    }
  }

  async sendLog(id) {
    return this.sendEvent({
      id,
      event: 'APPLICATION_LOG',
      data: { id, message: 'MSG ' + id },
    });
  }

  async sendLogs(ids, delay) {
    for (const id of ids) {
      await sleep(delay);
      await this.sendEvent({
        id,
        event: 'APPLICATION_LOG',
        data: { id, message: 'MSG ' + id },
      });
    }
  }

  async closeResponse() {
    while (this._response == null && this._alive) {
      await sleep(100);
    }
    this._response.end();
  }

  async destroyResponse() {
    while (this._response == null && this._alive) {
      await sleep(100);
    }
    this._response.destroy();
  }
}
