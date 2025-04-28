import { createRequestKey } from './mock-utils.js';

/**
 * @import {Mock, MockCall} from './mock-api.types.js'
 * @import {MockClient} from './mock-client.js'
 */

export class MockStub {
  /** @type {MockClient} */
  #mockClient;

  /**
   * @param {MockClient} mockClient
   */
  constructor(mockClient) {
    this.#mockClient = mockClient;
  }

  /**
   * @param {string} method
   * @param {string} path
   * @returns {{return: (status: number, body?: any) => MockStubOne}}
   */
  when(method, path) {
    return {
      return: (status, body) => {
        return new MockStubOne(this.#mockClient, {
          request: { method, path },
          response: { status, body },
        });
      },
    };
  }
}

class MockStubOne {
  /** @type {MockClient} */
  #mockClient;

  /** @type {Mock} */
  #mock;

  /**
   * @param {MockClient} mockClient
   * @param {Mock} mock
   */
  constructor(mockClient, mock) {
    this.#mockClient = mockClient;
    this.#mock = mock;
  }

  /**
   * @param {string} method
   * @param {string} path
   * @returns {{return: (status: number, body?: any) => MockStubMulti}}
   */
  when(method, path) {
    return {
      return: (status, body) => {
        const mock = {
          request: { method, path },
          response: { status, body },
        };
        return new MockStubMulti(this.#mockClient, [this.#mock, mock]);
      },
    };
  }

  /**
   * @param {() => Promise<T>} callback
   * @returns {MockStubSingleVerifier<T>}
   * @template T
   */
  then(callback) {
    return new MockStubSingleVerifier(this.#mockClient, callback, this.#mock);
  }
}

class MockStubMulti {
  /** @type {MockClient} */
  #mockClient;

  /** @type {Array<Mock>} */
  #mocks;

  /**
   * @param {MockClient} mockClient
   * @param {Array<Mock>} mocks
   */
  constructor(mockClient, mocks) {
    this.#mockClient = mockClient;
    this.#mocks = mocks;
  }

  /**
   * @param {string} method
   * @param {string} path
   * @returns {{return: (status: number, body?: any) => MockStubMulti}}
   */
  when(method, path) {
    return {
      return: (status, body) => {
        this.#mocks.push({
          request: { method, path },
          response: { status, body },
        });
        return this;
      },
    };
  }

  /**
   * @param {() => Promise<T>} callback
   * @returns {MockStubMultiVerifier<T>}
   * @template T
   */
  then(callback) {
    return new MockStubMultiVerifier(this.#mockClient, callback, this.#mocks);
  }
}

/**
 * @template T
 */
class MockStubVerifier {
  /** @type {MockClient} */
  _mockClient;
  /** @type {() => Promise<T>} */
  #callback;
  /** @type {Array<Mock>} */
  _mocks;
  /** @type {Array<() => void>} */
  _expectations;

  /**
   * @param {MockClient} mockClient
   * @param {() => Promise<T>} callback
   * @param {Array<Mock>} mocks
   */
  constructor(mockClient, callback, mocks) {
    this._mockClient = mockClient;
    this.#callback = callback;
    this._mocks = mocks;
    this._expectations = [];
  }

  /**
   * @returns {Promise<T>}
   * @private
   */
  async _toss() {
    await Promise.all(this._mocks.map((mock) => this._mockClient.mock(mock)));
    const result = await this.#callback();
    await this._internalToss();
    for (let expectation of this._expectations) {
      expectation();
    }
    return result;
  }

  async _internalToss() {}

  /**
   * @param {((res: T) => any)}  resolve
   * @param {(e: any) => void} reject
   */
  then(resolve, reject) {
    this._toss()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  }
}

/**
 * @template T
 * @extends {MockStubVerifier<T>}
 */
class MockStubSingleVerifier extends MockStubVerifier {
  /** @type {Array<MockCall>} */
  #calls;

  /**
   * @param {MockClient} mockClient
   * @param {() => Promise<T>} callback
   * @param {Mock} mock
   */
  constructor(mockClient, callback, mock) {
    super(mockClient, callback, [mock]);
  }

  /**
   *
   * @param {(calls: Array<MockCall>) => void} verifyCallback
   * @returns {this}
   */
  verify(verifyCallback) {
    this._expectations.push(() => {
      verifyCallback(this.#calls);
    });
    return this;
  }

  /**
   * @param {number} expected
   * @returns {this}
   */
  expectCallsCount(expected) {
    this._expectations.push(() => {
      if (this.#calls.length !== expected) {
        throw new Error(`Expected ${expected} calls but got ${this.#calls.length}`);
      }
    });

    return this;
  }

  async _internalToss() {
    this.#calls = await this._mockClient.getCalls(this._mocks[0].request);
  }
}

/**
 * @template T
 * @extends {MockStubVerifier<T>}
 */
class MockStubMultiVerifier extends MockStubVerifier {
  /** @type {Map<string, Array<MockCall>>} */
  #callsMap;

  /**
   * @param {(calls: Array<MockCall>) => void} verifyCallback
   * @param {string} method
   * @param {string} path
   * @returns {this}
   */
  verify(verifyCallback, method, path) {
    this._expectations.push(() => {
      verifyCallback(this.#getCalls(method, path));
    });
    return this;
  }

  /**
   * @param {number} expected
   * @param {string} method
   * @param {string} path
   * @returns {this}
   */
  expectCallsCount(expected, method, path) {
    const actualCount = this.#getCalls(method, path).length;
    if (actualCount !== expected) {
      throw new Error(`Expected ${expected} calls but got ${actualCount}`);
    }
    return this;
  }

  /**
   * @param {string} method
   * @param {string} path
   * @returns {Array<MockCall>}
   */
  #getCalls(method, path) {
    const key = createRequestKey({ method, path });
    return this.#callsMap.get(key) ?? [];
  }

  async _internalToss() {
    this.#callsMap = new Map();
    for (let mock of this._mocks) {
      this.#callsMap.set(createRequestKey(mock.request), await this._mockClient.getCalls(mock.request));
    }
  }
}
