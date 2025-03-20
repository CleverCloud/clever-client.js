import { AbstractCommand } from '../../lib/command/abstract-command.js';

/**
 * @extends {AbstractCommand<ResponseBody>}
 * @template ResponseBody
 * @abstract
 */
export class AbstractApiCommand extends AbstractCommand {
  /**
   * @returns {'api-command'}
   */
  get type() {
    return 'api-command';
  }

  isAuthRequired() {
    return true;
  }
}
