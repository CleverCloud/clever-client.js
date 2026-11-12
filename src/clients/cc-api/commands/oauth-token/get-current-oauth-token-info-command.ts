import { get } from '../../../../lib/request/request-params-builder.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetCurrentOauthTokenInfoCommandOutput } from './get-current-oauth-token-info-command.types.ts';
import { transformOauthToken } from './oauth-token-transform.ts';

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

  // the token is read back as is, neither refreshed nor rotated
  isIdempotent(): boolean {
    return true;
  }
}
