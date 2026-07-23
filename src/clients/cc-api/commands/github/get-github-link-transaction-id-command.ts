import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { GetGithubLinkTransactionIdCommandOutput } from './get-github-link-transaction-id-command.types.js';

/**
 * Opens a GitHub linking flow and returns where to send the user to authorise it.
 *
 * The transaction id identifies the flow and is needed to complete it once GitHub redirects back.
 *
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

  transformCommandOutput(response: unknown): GetGithubLinkTransactionIdCommandOutput {
    const { transactionId, redirectUri } = response as { transactionId: string; redirectUri: string };
    return { transactionId, redirectUrl: redirectUri };
  }
}
