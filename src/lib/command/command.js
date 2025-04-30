/**
 * @import { CcRequestParams } from '../../types/request.types.js'
 * @import { Composer } from '../../types/command.types.js'
 * @import { SelfOrPromise } from '../../types/utils.types.js'
 */

//--

/**
 * Abstract base class for all commands in the Clever Cloud API client.
 * Provides common functionality for parameter handling and API type identification.
 *
 * @template {string} Api - The API type this command targets (e.g., 'cc-api', 'cc-api-bridge')
 * @template CommandInput - The type of input parameters this command accepts
 * @abstract
 *
 * @example
 * ```javascript
 * class MyCommand extends AbstractCommand<'self', { id: string }> {
 *   get api() { return 'self'; }
 * }
 * const command = new MyCommand({ id: '123' });
 * ```
 */
export class AbstractCommand {
  /** @type {CommandInput} */
  #params;

  /**
   * Creates a new command instance with the given parameters
   *
   * @param {CommandInput} params - The input parameters for this command
   */
  constructor(params) {
    this.#params = params;
  }

  /**
   * Gets the input parameters provided to this command
   *
   * @returns {CommandInput} The command's input parameters
   */
  get params() {
    return this.#params;
  }

  /**
   * Gets the API type this command targets
   *
   * @returns {Api} The API type string (e.g., 'cc-api', 'cc-api-bridge')
   * @abstract
   * @throws {Error} When not implemented by a concrete class
   */
  get api() {
    throw new Error('Method not implemented');
  }
}

/**
 * Represents a simple, single-request command to the Clever Cloud API.
 * Handles parameter transformation, response processing, and error handling.
 *
 * @template {string} Api - The API type this command targets (e.g., 'cc-api', 'cc-api-bridge')
 * @template CommandInput - The type of input parameters this command accepts
 * @template CommandOutput - The type of processed response this command returns
 * @extends {AbstractCommand<Api, CommandInput>}
 * @abstract
 *
 * @example
 * ```javascript
 * class GetUser extends SimpleCommand<'cc-api', { userId: string }, User> {
 *   toRequestParams(params) {
 *     return { url: `/users/${params.userId}` };
 *   }
 * }
 * ```
 */
export class SimpleCommand extends AbstractCommand {
  /**
   * Transforms command parameters into HTTP request parameters
   *
   * @param {CommandInput} _params - The command's input parameters
   * @returns {SelfOrPromise<Partial<CcRequestParams>>} The HTTP request parameters (URL, method, etc.)
   * @abstract
   * @throws {Error} When not implemented by a concrete class
   */
  toRequestParams(_params) {
    throw new Error('Method not implemented');
  }

  /**
   * Determines how to handle empty responses from the API
   *
   * @param {number} _status - The HTTP status code
   * @param {any} _body - The response body
   * @returns {{isEmpty: boolean, emptyValue?: any}|null} Policy for handling empty responses:
   *   - null: treat response as non-empty
   *   - {isEmpty: true}: treat as empty, use emptyValue if provided
   */
  getEmptyResponsePolicy(_status, _body) {
    return null;
  }

  /**
   * Transforms the raw API response into the expected output format
   *
   * @param {any} response - The raw response from the API
   * @returns {CommandOutput} The processed response in the expected format
   */
  transformCommandOutput(response) {
    return response;
  }

  /**
   * Transforms API error codes into client-specific error codes
   *
   * @param {string} errorCode - The error code from the API
   * @returns {string} The transformed error code for client use
   */
  transformErrorCode(errorCode) {
    return errorCode;
  }
}

/**
 * Represents a complex command that composes multiple sub-commands.
 * Useful for operations that require multiple API calls or complex workflows.
 *
 * @template {string} Api - The API type this command targets (e.g., 'cc-api', 'cc-api-bridge')
 * @template CommandInput - The type of input parameters this command accepts
 * @template CommandOutput - The type of processed response this command returns
 * @extends {AbstractCommand<Api, CommandInput>}
 * @abstract
 *
 * @example
 * ```javascript
 * class DeployApp extends CompositeCommand<'cc-api', DeployParams, DeployResult> {
 *   async compose(params, composer) {
 *     const app = await composer.send(new CreateApp(params));
 *     return composer.send(new StartDeploy({ appId: app.id }));
 *   }
 * }
 * ```
 */
export class CompositeCommand extends AbstractCommand {
  /**
   * Executes the composite command by orchestrating multiple sub-commands
   *
   * @param {CommandInput} _params - The command's input parameters
   * @param {Composer<Api>} _composer - The composer utility for executing sub-commands
   * @returns {Promise<CommandOutput>} The final result after all sub-commands complete
   * @abstract
   * @throws {Error} When not implemented by a concrete class
   */
  async compose(_params, _composer) {
    throw new Error('Method not implemented');
  }
}
