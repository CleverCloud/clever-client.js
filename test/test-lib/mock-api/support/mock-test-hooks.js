import { MockClient } from '../mock-client.js';
import { MockCtrl } from '../mock-ctrl.js';

const IS_NODE = globalThis.process != null;

/** @type {MockCtrl} */
let mockCtrl;
let stopServer = () => {};

export function mockTestHooks() {
  return {
    /**
     * @returns {Promise<MockCtrl>}
     */
    before: async () => {
      if (IS_NODE) {
        const { mockStart } = await import('../mock-start.js');
        const mockServer = await mockStart();
        stopServer = mockServer.stop;
        mockCtrl = mockServer.ctrl;
      } else {
        const url = new URL(window.location.href);
        mockCtrl = new MockCtrl(new MockClient(`${url.origin}/mock`, `${url.origin}/api`));
      }

      return mockCtrl;
    },
    beforeEach: async () => {
      return mockCtrl?.mockClient.reset();
    },
    after: () => {
      stopServer();
    },
  };
}
