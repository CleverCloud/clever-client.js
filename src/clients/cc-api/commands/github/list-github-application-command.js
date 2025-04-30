/**
 * @import { ListGithubApplicationCommandOutput } from './list-github-application-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, ListGithubApplicationCommandOutput>}
 * @endpoint [GET] /v2/github/applications
 * @group Github
 * @version 2
 */
export class ListGithubApplicationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListGithubApplicationCommandOutput>['toRequestParams']} */
  toRequestParams() {
    return get(`/v2/github/applications`);
  }

  /** @type {CcApiSimpleCommand<void, ListGithubApplicationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(
      response.map(
        /** @param {any} payload*/ (payload) => ({
          id: payload.id,
          owner: payload.owner,
          name: payload.name,
          description: payload.description,
          gitUrl: payload.gitUrl,
          defaultBranch: payload.defaultBranch,
          private: payload.priv,
        }),
      ),
      'name',
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
