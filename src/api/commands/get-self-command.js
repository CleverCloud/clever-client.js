import { get } from '../../common/lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../common/cc-api-commands.js';

/**
 * @extends {CcApiSimpleCommand<import('./get-self-command.types.js').GetSelfCommandResponse>}
 */
export class GetSelfCommand extends CcApiSimpleCommand {
  toRequestParams() {
    return get('/v2/self');
  }
}
