import { findFreePorts } from 'find-free-ports';
import * as hanbi from 'hanbi';
import http from 'http';

export class TestServer {
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
