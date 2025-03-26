import { SimpleCommand } from '../../common/lib/command/simpleCommand.js';

/**
 * @extends {SimpleCommand<ResponseBody>}
 * @template ResponseBody
 * @abstract
 */
export class AbstractRedisHttpCommand extends SimpleCommand {
  /**
   * @returns {'redis-http-command'}
   */
  get type() {
    return 'redis-http-command';
  }
}
