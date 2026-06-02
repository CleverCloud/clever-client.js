import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { UnlinkGithubAccountCommandOutput } from './unlink-github-account-command.types.js';

/**
 * @endpoint [DELETE] /v2/github/link
 * @group Github
 * @version 2
 */
export class UnlinkGithubAccountCommand extends CcApiSimpleCommand<void, UnlinkGithubAccountCommandOutput> {
  toRequestParams() {
    return delete_(`/v2/github/link`);
  }
}
