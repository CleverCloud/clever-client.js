import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetGithubLinkTransactionIdCommandOutput } from './get-github-link-transaction-id-command.types.js';

/**
 * @endpoint [GET] /v2/github
 * @group Github
 * @version 2
 */
export class GetGithubLinkTransactionIdCommand extends CcApiSimpleCommand<
  void,
  GetGithubLinkTransactionIdCommandOutput
> {
  toRequestParams() {
    return get(`/v2/github`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }
}
