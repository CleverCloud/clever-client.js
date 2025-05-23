/**
 * @import { UpdateProfileAvatarCommandInput, UpdateProfileAvatarCommandOutput } from './update-profile-avatar-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateProfileAvatarCommandInput, UpdateProfileAvatarCommandOutput>}
 * @endpoint [PUT] /v2/self/avatar
 * @group Profile
 * @version 2
 */
export class UpdateProfileAvatarCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateProfileAvatarCommandInput, UpdateProfileAvatarCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(`/v2/self/avatar`, {});
  }
}
