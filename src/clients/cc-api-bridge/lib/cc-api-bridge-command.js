import { SimpleCommand } from '../../../lib/command/command.js';

/**
 * @extends {SimpleCommand<'auth-backend', CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class CcApiBridgeCommand extends SimpleCommand {
  isAuthRequired() {
    return true;
  }

  /** @type {SimpleCommand<'auth-backend', CommandInput, CommandOutput>['api']} */
  get api() {
    return 'auth-backend';
  }
}
