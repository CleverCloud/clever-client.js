import type { CcClient } from '../lib/cc-client.js';
import { CompositeCommand, SimpleCommand } from '../lib/command/command.js';

export type Command<Api extends string, CommandInput, CommandOutput> =
  | SimpleCommand<Api, CommandInput, CommandOutput>
  | CompositeCommand<Api, CommandInput, CommandOutput>;

export type Composer<Api extends string> = Pick<CcClient<Api>, 'send'>;
