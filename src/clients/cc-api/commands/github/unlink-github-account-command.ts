import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';

/**
 * Unlinks the GitHub account from the current user.
 *
 * Applications deployed from a GitHub repository stop being redeployed automatically once the link is gone.
 *
 * @endpoint [DELETE] /v2/github/link
 * @group Github
 * @version 2
 */
export class UnlinkGithubAccountCommand extends CcApiSimpleCommand<void, undefined> {
  toRequestParams() {
    return delete_(`/v2/github/link`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  isIdempotent(): boolean {
    return true;
  }
}
