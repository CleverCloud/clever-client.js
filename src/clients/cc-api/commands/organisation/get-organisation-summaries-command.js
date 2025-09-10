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
    /** @type {Array<OrganisationSummary>} */
    const organisations =
      response.organisations
        ?.filter((/** @type {any} */ summary) => summary.id !== response.user.id)
        .map((/** @type {any} */ summary) => transformOrganisationSummary(summary, false)) ?? [];

    return [transformOrganisationSummary(response.user, true), ...sortBy(organisations, 'name')];
  }
}

/**
 * @param {any} payload
 * @param {boolean} isPersonal
 * @returns {OrganisationSummary}
 */
function transformOrganisationSummary(payload, isPersonal) {
  return {
    id: payload.id,
    name: payload.name,
    avatar: payload.avatar,
    applications: sortBy(payload.applications ?? [], 'name', 'id'),
    addons: sortBy(payload.addons ?? [], 'name', 'id'),
    consumers: sortBy(payload.consumers ?? [], 'name', 'key'),
    providers: sortBy(payload.providers ?? [], 'name', 'id'),
    role: payload.role,
    vatState: payload.vatState,
    canPay: payload.canPay,
    canSEPA: payload.canSEPA,
    cleverEnterprise: payload.cleverEnterprise,
    emergencyNumber: payload.emergencyNumber,
    isTrusted: payload.isTrusted,
    isPersonal: isPersonal,
  };
}
