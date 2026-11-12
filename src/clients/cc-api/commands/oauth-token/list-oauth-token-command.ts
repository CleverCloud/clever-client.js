import { get } from '../../../../lib/request/request-params-builder.ts';
import { sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { ListTokenCommandOutput } from './list-oauth-token-command.types.ts';
import { transformOauthToken } from './oauth-token-transform.ts';

/**
 * Lists Oauth tokens.
 *
 * This command is for internal use only.
 *
 * @endpoint [GET] /v2/self/tokens
 * @group Token
 * @version 2
 */
export class ListOauthTokenCommand extends CcApiSimpleCommand<void, ListTokenCommandOutput> {
  toRequestParams() {
    return get(`/v2/self/tokens`);
  }

  transformCommandOutput(response: unknown): ListTokenCommandOutput {
    return sortBy((response as Array<unknown>).map(transformOauthToken), { key: 'createdAt', order: 'desc' });
  }

  isIdempotent(): boolean {
    return true;
  }
}
