import { get } from '../../../../lib/request/request-params-builder.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetProfileCommandOutput } from './get-profile-command.types.ts';
import { transformProfile } from './profile-transform.ts';

/**
 * Retrieves the account of the signed-in user.
 *
 * @endpoint [GET] /v2/self
 * @group Profile
 * @version 2
 */
export class GetProfileCommand extends CcApiSimpleCommand<void, GetProfileCommandOutput> {
  toRequestParams() {
    return get('/v2/self');
  }

  transformCommandOutput(response: unknown): GetProfileCommandOutput {
    return transformProfile(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
