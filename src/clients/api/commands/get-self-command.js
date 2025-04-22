import { get } from '../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../lib/cc-api-command.js';

/**
 * @typedef {import('./get-self-command.types.js').GetSelfCommandOutput} GetSelfCommandOutput
 */

/**
 * @extends {CcApiSimpleCommand<void, GetSelfCommandOutput>}
 */
export class GetSelfCommand extends CcApiSimpleCommand {
  toRequestParams() {
    return get('/v2/self');
  }
}
