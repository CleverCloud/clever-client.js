import { MockStub } from './mock-stub.js';

/**
 * @import { MockClient } from './mock-client.js';
 */

export class MockCtrl {
  /** @type {MockClient} */
  #mockClient;

  /**
   * @param {MockClient} mockClient
   */
  constructor(mockClient) {
    this.#mockClient = mockClient;
  }

  get mockClient() {
    return this.#mockClient;
  }

  /**
   * Initiate a new mock
   * @returns {MockStub}
   */
  mock() {
    return new MockStub(this.#mockClient);
  }
}
