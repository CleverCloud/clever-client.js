/**
 * @import { GetGithubLinkTransactionIdCommandOutput } from './get-github-link-transaction-id-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, GetGithubLinkTransactionIdCommandOutput>}
 * @endpoint [GET] /v2/github
 * @group Github
 * @version 2
 */
export class GetGithubLinkTransactionIdCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, GetGithubLinkTransactionIdCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/github`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}
