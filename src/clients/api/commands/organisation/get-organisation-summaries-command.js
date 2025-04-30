/**
 * @import { GetOrganisationSummariesCommandOutput } from './get-organisation-summaries-command.types.js'
 * @import { OrganisationSummary } from './organisation.types.js'
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @extends {CcApiSimpleCommand<void, GetOrganisationSummariesCommandOutput>}
 */
export class GetOrganisationSummariesCommand extends CcApiSimpleCommand {
  toRequestParams() {
    return get('/v2/summary');
  }

  /** @type {CcApiSimpleCommand<void, GetOrganisationSummariesCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    const userId = response.user.id;

    return [
      { ...response.user, isPersonal: true },
      ...(response.organisations
        ?.filter((/** @type {OrganisationSummary} */ organisations) => organisations.id !== userId)
        .map((/** @type {OrganisationSummary} */ organisation) => ({ ...organisation, isPersonal: false })) ?? []),
    ];
  }
}
