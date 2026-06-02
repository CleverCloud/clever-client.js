import type { Composer } from '../../types/command.types.js';
import type { CcRequestParams } from '../../types/request.types.js';
import type { SelfOrPromise } from '../../types/utils.types.js';

//--

/**
 * Abstract base class for all commands in the Clever Cloud API client.
 * Provides common functionality for parameter handling and API type identification.
 *
 * @template Api - The API type this command targets (e.g., 'cc-api', 'cc-api-bridge')
 * @template CommandInput - The type of input parameters this command accepts
 *
 * @example
 * ```typescript
 * class MyCommand extends AbstractCommand<'self', { id: string }> {
 *   get api() { return 'self'; }
 * }
 * const command = new MyCommand({ id: '123' });
 * ```
 */
export class AbstractCommand<Api extends string, CommandInput> {
  #params: CommandInput;

  /**
   * Creates a new command instance with the given parameters
   *
   * @param params - The input parameters for this command
   */
  constructor(params: CommandInput) {
    this.#params = params;
  }

  /**
   * Gets the input parameters provided to this command
   */
  get params(): CommandInput {
    return this.#params;
  }

  /**
   * Gets the API type this command targets.
   * Must be implemented by a concrete class.
   */
  get api(): Api {
    throw new Error('Method not implemented');
  }
}

/**
 * Represents a simple, single-request command to the Clever Cloud API.
 * Handles parameter transformation, response processing, and error handling.
 *
 * @template Api - The API type this command targets (e.g., 'cc-api', 'cc-api-bridge')
 * @template CommandInput - The type of input parameters this command accepts
 * @template CommandOutput - The type of processed response this command returns
 *
 * @example
 * ```typescript
 * class GetUser extends SimpleCommand<'cc-api', { userId: string }, User> {
 *   toRequestParams(params) {
 *     return { url: `/users/${params.userId}` };
 *   }
 * }
 * ```
 */
export class SimpleCommand<Api extends string, CommandInput, CommandOutput> extends AbstractCommand<Api, CommandInput> {
  /**
   * Transforms command parameters into HTTP request parameters.
   * Must be implemented by a concrete class.
   *
   * @param _params - The command's input parameters
   * @returns The HTTP request parameters (URL, method, etc.)
   */
  toRequestParams(_params: CommandInput): SelfOrPromise<Partial<CcRequestParams>> {
    throw new Error('Method not implemented');
  }

  /**
   * Determines how to handle empty responses from the API.
   *
   * @param _status - The HTTP status code
   * @param _body - The response body
   * @returns Policy for handling empty responses:
   *   - null: treat response as non-empty
   *   - {isEmpty: true}: treat as empty, use emptyValue if provided
   */
  getEmptyResponsePolicy(_status: number, _body?: unknown): { isEmpty: boolean; emptyValue?: unknown } | null {
    return null;
  }

  /**
   * Transforms the raw API response into the expected output format
   *
   * @param response - The raw response from the API
   * @returns The processed response in the expected format
   */
  transformCommandOutput(response: unknown): CommandOutput {
    return response as CommandOutput;
  }

  /**
   * Transforms API error codes into client-specific error codes
   *
   * @param errorCode - The error code from the API
   * @returns The transformed error code for client use
   */
  transformErrorCode(errorCode: string): string {
    return errorCode;
  }
}

/**
 * Represents a complex command that composes multiple sub-commands.
 * Useful for operations that require multiple API calls or complex workflows.
 *
 * @template Api - The API type this command targets (e.g., 'cc-api', 'cc-api-bridge')
 * @template CommandInput - The type of input parameters this command accepts
 * @template CommandOutput - The type of processed response this command returns
 *
 * @example
 * ```typescript
 * class DeployApp extends CompositeCommand<'cc-api', DeployParams, DeployResult> {
 *   async compose(params, composer) {
 *     const app = await composer.send(new CreateApp(params));
 *     return composer.send(new StartDeploy({ appId: app.id }));
 *   }
 * }
 * ```
 */
export class CompositeCommand<Api extends string, CommandInput, CommandOutput> extends AbstractCommand<
  Api,
  CommandInput
> {
  /**
   * Executes the composite command by orchestrating multiple sub-commands.
   * Must be implemented by a concrete class.
   *
   * @param _params - The command's input parameters
   * @param _composer - The composer utility for executing sub-commands
   * @returns The final result after all sub-commands complete
   */
  compose(_params: CommandInput, _composer: Composer<Api>): Promise<CommandOutput> {
    throw new Error('Method not implemented');
  }
}
