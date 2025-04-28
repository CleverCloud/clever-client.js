/**
 * @import { MockClient } from './mock-client.js';
 */
import { MockStub } from './mock-stub.js';

/**
 * Controller class that provides a fluent interface for creating and managing mock API responses.
 * Acts as a factory for MockStub instances and provides access to the underlying MockClient.
 *
 * This class serves as the main entry point for setting up mocks in tests,
 * providing a more convenient API than using MockClient directly.
 */
export class MockCtrl {
  /** @type {MockClient} The underlying mock client instance */
  #mockClient;

  /**
   * Creates a new MockCtrl instance.
   *
   * @param {MockClient} mockClient - The mock client to use for API operations
   */
  constructor(mockClient) {
    this.#mockClient = mockClient;
  }

  /**
   * Gets the underlying MockClient instance.
   * Useful for operations not available through the fluent interface.
   *
   * @returns {MockClient} The mock client instance
   */
  get mockClient() {
    return this.#mockClient;
  }

  /**
   * Creates a new MockStub for defining a mock response.
   * Returns a fluent interface that allows chaining method calls to configure the mock.
   *
   * @returns {MockStub} A new mock stub instance for configuring the mock
   */
  mock() {
    return new MockStub(this.#mockClient);
  }
}
