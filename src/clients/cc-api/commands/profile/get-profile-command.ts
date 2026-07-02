import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetProfileCommandOutput } from './get-profile-command.types.js';
import { transformProfile } from './profile-transform.js';

/**
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
}
