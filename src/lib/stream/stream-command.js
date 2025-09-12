/**
 * @import { CcRequestParams } from '../../types/request.types.js'
 * @import { CcStream } from '../stream/cc-stream.js'
 * @import { CcStreamRequestFactory, CcStreamConfig } from '../stream/cc-stream.types.js'
 * @import { SelfOrPromise } from '../../types/utils.types.js'
 */

/**
 * Abstract base class for stream commands that define how to create and configure streams.
 * Stream commands encapsulate the logic for transforming input parameters into HTTP requests
 * and creating the appropriate stream instances.
 *
 * @template {string} Api - The API type this stream command targets
 * @template CommandInput - The input parameters type for the command
 * @template {CcStream} Stream - The type of stream this command creates
 * @abstract
 */
export class StreamCommand {
  /** @type {CommandInput} */
  #params;

  /**
   * Creates a new stream command with the given parameters.
   *
   * @param {CommandInput} params - The input parameters for the command
   */
  constructor(params) {
    this.#params = params;
  }

  /**
   * Gets the API type that this stream command targets.
   *
   * @returns {Api} The API type identifier
   * @abstract
   */
  get api() {
    throw new Error('Method not implemented');
  }

  /**
   * Gets the input parameters for this command.
   *
   * @return {CommandInput} The command's input parameters
   */
  get params() {
    return this.#params;
  }

  /**
   * Transforms command parameters into HTTP request parameters
   *
   * @param {CommandInput} _params - The command's input parameters
   * @returns {SelfOrPromise<Partial<CcRequestParams>>} The HTTP request parameters (URL, method, etc.)
   * @abstract
   */
  toRequestParams(_params) {
    throw new Error('Method not implemented');
  }

  /**
   * Creates the Stream object for the command with the given request factory and configuration.
   * This method defines how the specific stream type should be instantiated and configured.
   *
   * @param {CcStreamRequestFactory} _requestFactory - Factory function that creates HTTP requests
   * @param {CcStreamConfig} _config - Stream configuration options
   * @returns {Stream} The created stream instance
   * @abstract
   */
  createStream(_requestFactory, _config) {
    throw new Error('Method not implemented');
  }
}
