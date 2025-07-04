/**
 * @import { GetOrganisationSummariesCommandOutput } from './get-organisation-summaries-command.types.js'
 * @import { OrganisationSummary } from './organisation.types.js'
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @extends {CcApiSimpleCommand<void, GetOrganisationSummariesCommandOutput>}
 * @endpoint [GET] /v2/summary
 * @group Organisation
 * @version 2
 */
export class GetOrganisationSummariesCommand extends CcApiSimpleCommand {
  toRequestParams() {
    return get('/v2/summary');
  }

  /** @type {CcApiSimpleCommand<void, GetOrganisationSummariesCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    const userId = response.user.id;

    /** @type {Array<OrganisationSummary>} */
    const organisations =
      response.organisations
        ?.filter((/** @type {OrganisationSummary} */ organisations) => organisations.id !== userId)
        .map((/** @type {OrganisationSummary} */ organisation) => ({ ...organisation, isPersonal: false })) ?? [];

    return [{ ...response.user, isPersonal: true }, ...sortBy(organisations, 'name')];
  }
}
