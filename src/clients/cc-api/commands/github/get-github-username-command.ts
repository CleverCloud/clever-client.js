import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetGithubUsernameCommandOutput } from './get-github-username-command.types.js';

/**
 * Retrieves the GitHub user name of the account linked to the current user.
 *
 * @endpoint [GET] /v2/github/username
 * @group Github
 * @version 2
 */
export class GetGithubUsernameCommand extends CcApiSimpleCommand<void, GetGithubUsernameCommandOutput> {
  toRequestParams() {
    return get(`/v2/github/username`);
  }

  isIdempotent(): boolean {
    return true;
  }
}
