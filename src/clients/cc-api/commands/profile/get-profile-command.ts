/**
 * @import { GetProfileCommandOutput } from './get-profile-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformProfile } from './profile-transform.js';

/**
 * @extends {CcApiSimpleCommand<void, GetProfileCommandOutput>}
 * @endpoint [GET] /v2/self
 * @group Profile
 * @version 2
 */
export class GetProfileCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, GetProfileCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get('/v2/self');
  }

  /** @type {CcApiSimpleCommand<void, GetProfileCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformProfile(response);
  }
}
