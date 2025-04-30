/**
 * @import { UpdateProfileCommandInput, UpdateProfileCommandOutput } from './update-profile-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformProfile } from './profile-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateProfileCommandInput, UpdateProfileCommandOutput>}
 * @endpoint [PUT] /v2/self
 * @group Profile
 * @version 2
 */
export class UpdateProfileCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateProfileCommandInput, UpdateProfileCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(`/v2/self`, params);
  }

  /** @type {CcApiSimpleCommand<UpdateProfileCommandInput, UpdateProfileCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformProfile(response);
  }
}
