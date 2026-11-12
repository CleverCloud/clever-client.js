import { get } from '../../../../lib/request/request-params-builder.ts';
import { sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import { transformGithubApplication } from './github-transform.ts';
import type { ListGithubApplicationCommandOutput } from './list-github-application-command.types.ts';

/**
 * Lists the GitHub repositories the linked account gives access to, so that one can be picked as the source of an
 * application.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}
