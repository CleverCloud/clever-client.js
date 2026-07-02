import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetGithubUsernameCommandOutput } from './get-github-username-command.types.js';

/**
 * @endpoint [GET] /v2/github/username
 * @group Github
 * @version 2
 */
export class GetGithubUsernameCommand extends CcApiSimpleCommand<void, GetGithubUsernameCommandOutput> {
  toRequestParams() {
    return get(`/v2/github/username`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
