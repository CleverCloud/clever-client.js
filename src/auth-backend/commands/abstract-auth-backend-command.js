import { AbstractCommand } from '../../lib/command/abstract-command.js';

/**
 * @extends {AbstractCommand<ResponseBody>}
 * @template ResponseBody
 * @abstract
 */
export class AbstractAuthBackendCommand extends AbstractCommand {
  /**
   * @returns {'auth-backend-command'}
   */
  get type() {
    return 'auth-backend-command';
  }

  isAuthRequired() {
    return true;
  }
}
