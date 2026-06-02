import { put } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformProfile } from './profile-transform.js';
import type { UpdateProfileCommandInput, UpdateProfileCommandOutput } from './update-profile-command.types.js';

/**
 * @endpoint [PUT] /v2/self
 * @group Profile
 * @version 2
 */
export class UpdateProfileCommand extends CcApiSimpleCommand<UpdateProfileCommandInput, UpdateProfileCommandOutput> {
  toRequestParams(params: UpdateProfileCommandInput) {
    return put(`/v2/self`, params);
  }

  transformCommandOutput(response: unknown): UpdateProfileCommandOutput {
    return transformProfile(response);
  }
}
