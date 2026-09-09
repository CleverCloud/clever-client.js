import type { ApiErrorInfo, Composer } from '../../types/command.types.js';
import type { CcRequestConfigPartial, CcRequestParams } from '../../types/request.types.js';
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
export abstract class AbstractCommand<Api extends string, CommandInput> {
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
  abstract get api(): Api;

  /**
   * Gets the request configuration this command needs.
   * Override for commands whose endpoint only works with a specific configuration, like a command targeting
   * another origin, which browsers only reach with CORS enabled.
   *
   * It takes precedence over the client default configuration, but the configuration given to `send()` still
   * wins, so that a caller can always override it explicitly.
   *
   * @returns The request configuration, or `undefined` to only rely on the client and caller configuration
   */
  getRequestConfig(): CcRequestConfigPartial | undefined {
    return undefined;
  }

  /**
   * Whether this command can be sent twice without meaning it twice.
   *
   * It answers the question a caller asks after a failure that may or may not have reached the server:
   * can this be sent again. What counts is the effect, not the answer — two calls leaving the same state
   * are idempotent even when the second one answers 404.
   *
   * Override to `true` only once the route has been read and its replay is known to change nothing
   * further. The default is `false` because an unchecked endpoint is an unknown one, and the cost of
   * being wrong is an action performed twice. The HTTP method does not answer it either: a `PUT` that
   * mails a confirmation is not replayable, and a read behind a `POST` is.
   *
   * For a composite command, it is about replaying the whole command: one that creates and then waits is
   * not replayable, whatever its individual steps do. The client applies it as a ceiling over every
   * request the composite makes, so a step is only replayable if the composite is too.
   *
   * @returns Whether sending this command again means it again
   */
  isIdempotent(): boolean {
    return false;
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
export abstract class SimpleCommand<Api extends string, CommandInput, CommandOutput> extends AbstractCommand<
  Api,
  CommandInput
> {
  /**
   * Transforms command parameters into HTTP request parameters.
   * Must be implemented by a concrete class.
   *
   * @param _params - The command's input parameters
   * @returns The HTTP request parameters (URL, method, etc.)
   */
  abstract toRequestParams(_params: CommandInput): SelfOrPromise<Partial<CcRequestParams>>;

  /**
   * Transforms the raw API response into the expected output format.
   * May be asynchronous, the client awaits the result.
   *
   * @param response - The raw response from the API
   * @returns The processed response in the expected format
   */
  transformCommandOutput(response: unknown): SelfOrPromise<CommandOutput> {
    return response as CommandOutput;
  }

  /**
   * Transforms an API error into a client-specific error code.
   *
   * @param error - What could be parsed from the error response: its code, its message and its HTTP status
   * @returns The transformed error code for client use
   */
  transformErrorCode(error: ApiErrorInfo): string {
    return error.code;
  }

  /**
   * Determines whether the client's authentication should be applied to this command's request.
   * Override to return `false` for commands that must be sent unauthenticated.
   *
   * @returns Whether authentication should be applied
   */
  isAuthEnabled(): boolean {
    return true;
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
export abstract class CompositeCommand<Api extends string, CommandInput, CommandOutput> extends AbstractCommand<
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
  abstract compose(_params: CommandInput, _composer: Composer<Api>): Promise<CommandOutput>;
}
