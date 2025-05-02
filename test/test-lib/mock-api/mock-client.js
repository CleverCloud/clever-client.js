/**
 * @import {Mock, MockCall, MockRequest} from './mock-api.types.js';
 */

export class MockClient {
  /** @type {string} */
  #baseUrlAdmin;

  /** @type {string} */
  #baseUrlMock;

  /**
   *
   * @param {string} baseUrlAdmin
   * @param {string} baseUrlMock
   */
  constructor(baseUrlAdmin, baseUrlMock) {
    this.#baseUrlAdmin = baseUrlAdmin;
    this.#baseUrlMock = baseUrlMock;
  }

  /**
   * @returns {string}
   */
  get baseUrl() {
    return this.#baseUrlMock;
  }

  async reset() {
    const response = await fetch(`${this.#baseUrlAdmin}/reset`, {
      method: 'POST',
    });

    if (!response.ok) {
      console.log(response.status);
      throw new Error(`Failed to reset: ${response.status}`);
    }
  }

  /**
   * @param {Mock} mock
   */
  async mock(mock) {
    const response = await fetch(`${this.#baseUrlAdmin}/mock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mock),
    });

    if (!response.ok) {
      throw new Error(`Failed to mock: ${response.status}`);
    }
  }

  /**
   * @param {MockRequest} mockRequest
   * @returns {Promise<Array<MockCall>>}
   */
  async getCalls({ method, path }) {
    const response = await fetch(`${this.#baseUrlAdmin}/calls`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ method, path }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get calls: ${response.status}`);
    }

    return await response.json();
  }
}
