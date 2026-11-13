import { put } from '../../../../lib/request/request-params-builder.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import { transformProfile } from './profile-transform.ts';
import type { UpdateProfileCommandInput, UpdateProfileCommandOutput } from './update-profile-command.types.ts';

/**
 * Updates the account of the signed-in user.
 *
 * Only the given fields are changed. The email address, the avatar and the password have their own
 * commands.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}
