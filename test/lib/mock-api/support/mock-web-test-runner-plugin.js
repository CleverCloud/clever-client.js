import proxy from 'koa-proxies';
import { startServer } from '../mock-server.js';

let stopServer = () => {};

export const mockApiPlugin = {
  name: 'mock-apis',
  // @ts-ignore
  serverStart: async ({ app }) => {
    const mockServer = await startServer();
    stopServer = mockServer.stop;
    app.use(
      proxy('/api', {
        rewrite: (path) => path.replace(/^\/api\//g, '/'),
        target: `http://localhost:${mockServer.mockPort}`,
      }),
    );
    app.use(
      proxy('/mock', {
        rewrite: (path) => path.replace(/^\/mock\//g, '/'),
        target: `http://localhost:${mockServer.adminPort}`,
      }),
    );
  },
  stopServer: () => {
    stopServer();
  },
};
