/**
 * @import { GetGithubUsernameCommandOutput } from './get-github-username-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, GetGithubUsernameCommandOutput>}
 * @endpoint [GET] /v2/github/username
 * @group Github
 * @version 2
 */
export class GetGithubUsernameCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, GetGithubUsernameCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/github/username`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
