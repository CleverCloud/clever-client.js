import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformGithubApplication } from './github-transform.js';
import type { ListGithubApplicationCommandOutput } from './list-github-application-command.types.js';

/**
 * @endpoint [GET] /v2/github/applications
 * @group Github
 * @version 2
 */
export class ListGithubApplicationCommand extends CcApiSimpleCommand<void, ListGithubApplicationCommandOutput> {
  toRequestParams() {
    return get(`/v2/github/applications`);
  }

  transformCommandOutput(response: unknown): ListGithubApplicationCommandOutput {
    return sortBy((response as Array<unknown>).map(transformGithubApplication), 'name');
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
