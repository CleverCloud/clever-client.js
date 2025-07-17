/**
 * @import { RedisHttpType } from '../types/redis-http.types.js'
 */
import { SimpleCommand } from '../../../lib/command/command.js';

/**
 * @extends {SimpleCommand<RedisHttpType, CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class RedisHttpCommand extends SimpleCommand {
  /** @type {SimpleCommand<RedisHttpType, CommandInput, CommandOutput>['api']} */
  get api() {
    return 'redis-http';
  }

  requiresBackendUrl() {
    return true;
  }
}
