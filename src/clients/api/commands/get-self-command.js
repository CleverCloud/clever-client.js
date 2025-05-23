/**
 * @import { GetSelfCommandOutput } from './get-self-command.types.js'
 */
import { get } from '../../../lib/request/request-params-builder.js';
import { normalizeDate } from '../../../lib/utils.js';
import { CcApiSimpleCommand } from '../lib/cc-api-command.js';

/**
 * @extends {CcApiSimpleCommand<void, GetSelfCommandOutput>}
 */
export class GetSelfCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ?>['toRequestParams']} */
  toRequestParams() {
    return get('/v2/self');
  }

  /** @type {CcApiSimpleCommand<?, GetSelfCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      ...response,
      creationDate: normalizeDate(response.creationDate),
    };
  }
}
