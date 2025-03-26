import type { CcClient } from '../lib/cc-client.js';
import { CompositeCommand, SimpleCommand } from '../lib/command/simpleCommand.js';

export type Command<ResponseBody, Client extends CcClient = CcClient> =
  | SimpleCommand<ResponseBody>
  | CompositeCommand<ResponseBody, Client>;

export type ComposeClient<Client extends CcClient> = Pick<Client, 'send'>;
