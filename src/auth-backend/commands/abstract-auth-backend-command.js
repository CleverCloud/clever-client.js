import { SimpleCommand } from '../../common/lib/command/simpleCommand.js';

/**
 * @extends {SimpleCommand<ResponseBody>}
 * @template ResponseBody
 * @abstract
 */
export class AbstractAuthBackendCommand extends SimpleCommand {
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
