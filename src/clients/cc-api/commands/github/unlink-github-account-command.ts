/**
 * @import { UnlinkGithubAccountCommandOutput } from './unlink-github-account-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, UnlinkGithubAccountCommandOutput>}
 * @endpoint [DELETE] /v2/github/link
 * @group Github
 * @version 2
 */
export class UnlinkGithubAccountCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, UnlinkGithubAccountCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return delete_(`/v2/github/link`);
  }
}
