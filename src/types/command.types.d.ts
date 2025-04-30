import type { CcClient } from '../lib/cc-client.js';
import { CompositeCommand, SimpleCommand } from '../lib/command/command.js';

/**
 * Represents a command that can be executed by the Clever Cloud API client.
 * Can be either a simple command (single request) or a composite command (multiple requests).
 *
 * @template Api - The API endpoint type this command targets
 * @template CommandInput - The input type required by the command
 * @template CommandOutput - The expected output type from the command
 *
 * @example
 * type ListAppsCommand = Command<'apps', void, App[]>;
 * type CreateAppCommand = Command<'apps', CreateAppParams, App>;
 */
export type Command<Api extends string, CommandInput, CommandOutput> =
  | SimpleCommand<Api, CommandInput, CommandOutput>
  | CompositeCommand<Api, CommandInput, CommandOutput>;

/**
 * A subset of the CcClient interface that only includes the send method.
 * Used for composing commands that need to make additional API calls.
 *
 * @template Api - The API endpoint type this composer can send requests to
 */
export type Composer<Api extends string> = Pick<CcClient<Api>, 'send'>;
