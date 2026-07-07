import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetCurrentOauthTokenInfoCommandOutput } from './get-current-oauth-token-info-command.types.js';
import { transformOauthToken } from './oauth-token-transform.js';

/**
 * Gets info about the Oauth token used to authenticate the current request.
 *
 * @endpoint [GET] /v2/self/tokens/current
 * @group Token
 * @version 2
 */
export class GetCurrentOauthTokenInfoCommand extends CcApiSimpleCommand<void, GetCurrentOauthTokenInfoCommandOutput> {
  toRequestParams() {
    return get(`/v2/self/tokens/current`);
  }

  transformCommandOutput(response: unknown): GetCurrentOauthTokenInfoCommandOutput {
    return transformOauthToken(response);
  }
}
