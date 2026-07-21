import type { CcClient } from '../lib/cc-client.js';
import type { CompositeCommand, SimpleCommand } from '../lib/command/command.js';

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
 * The parts of an HTTP error response a command may need to figure out which error code to report.
 *
 * Most commands only look at `code`, but some endpoints reuse a single code for several distinct
 * failures and only the message or the status tells them apart.
 */
export interface ApiErrorInfo {
  /** The error code parsed from the response body (its `code` or `id` field). */
  code: string;
  /** The error message parsed from the response body, when there is one. */
  message?: string;
  /** The HTTP status code of the response. */
  status: number;
}

/**
 * A subset of the CcClient interface that only includes the send method.
 * Used for composing commands that need to make additional API calls.
 *
 * @template Api - The API endpoint type this composer can send requests to
 */
export type Composer<Api extends string> = Pick<CcClient<Api>, 'send'>;
