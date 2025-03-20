import { AbstractCommand } from '../../lib/command/abstract-command.js';

/**
 * @extends {AbstractCommand<ResponseBody>}
 * @template ResponseBody
 * @abstract
 */
export class AbstractRedisHttpCommand extends AbstractCommand {
  /**
   * @returns {'redis-http-command'}
   */
  get type() {
    return 'redis-http-command';
  }
}
