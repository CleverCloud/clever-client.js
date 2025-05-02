import { MockClient } from './mock-client.js';
import { MockCtrl } from './mock-ctrl.js';
import { startServer } from './mock-server.js';

/**
 * @returns {Promise<{stop: () => void, ctrl: MockCtrl}>}
 */
export async function mockStart() {
  const { adminPort, mockPort, stop } = await startServer();
  return {
    stop,
    ctrl: new MockCtrl(new MockClient(`http://localhost:${adminPort}`, `http://localhost:${mockPort}`)),
  };
}
