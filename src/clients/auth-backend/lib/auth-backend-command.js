import { SimpleCommand } from '../../../lib/command/command.js';

/**
 * @extends {SimpleCommand<'auth-backend', CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class AuthBackendCommand extends SimpleCommand {
  isAuthRequired() {
    return true;
  }
}
