import type { CcRequestParams } from '../../types/request.types.js';
import type { SelfOrPromise } from '../../types/utils.types.js';
import type { CcStream } from './cc-stream.js';
import type { CcStreamConfig, CcStreamRequestFactory } from './cc-stream.types.js';

/**
 * Abstract base class for stream commands that define how to create and configure streams.
 * Stream commands encapsulate the logic for transforming input parameters into HTTP requests
 * and creating the appropriate stream instances.
 *
 * @template Api - The API type this stream command targets
 * @template CommandInput - The input parameters type for the command
 * @template Stream - The type of stream this command creates
 */
export abstract class StreamCommand<Api extends string, CommandInput, Stream extends CcStream> {
  #params: CommandInput;

  /**
   * Creates a new stream command with the given parameters.
   *
   * @param params - The input parameters for the command
   */
  constructor(params: CommandInput) {
    this.#params = params;
  }

  /**
   * Gets the API type that this stream command targets.
   */
  abstract get api(): Api;

  /**
   * Gets the input parameters for this command.
   */
  get params(): CommandInput {
    return this.#params;
  }

  /**
   * Transforms command parameters into HTTP request parameters
   *
   * @param _params - The command's input parameters
   * @returns The HTTP request parameters (URL, method, etc.)
   */
  abstract toRequestParams(_params: CommandInput): SelfOrPromise<Partial<CcRequestParams>>;

  /**
   * Creates the Stream object for the command with the given request factory and configuration.
   * This method defines how the specific stream type should be instantiated and configured.
   *
   * @param _requestFactory - Factory function that creates HTTP requests
   * @param _config - Stream configuration options
   * @returns The created stream instance
   */
  abstract createStream(_requestFactory: CcStreamRequestFactory, _config: CcStreamConfig): Stream;
}
