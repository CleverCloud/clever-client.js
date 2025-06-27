import { SimpleCommand } from '../../../lib/command/command.js';

/**
 * @extends {SimpleCommand<'redis-http', CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class RedisHttpCommand extends SimpleCommand {
  /** @type {SimpleCommand<'redis-http', CommandInput, CommandOutput>['api']} */
  get api() {
    return 'redis-http';
  }
}
