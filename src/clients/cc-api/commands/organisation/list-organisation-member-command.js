/**
 * @import { ListOrganisationMemberCommandInput, ListOrganisationMemberCommandOutput } from './list-organisation-member-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformOrganisationMember } from './organisation-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListOrganisationMemberCommandInput, ListOrganisationMemberCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/members
 * @group Organisation
 * @version 2
 */
export class ListOrganisationMemberCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListOrganisationMemberCommandInput, ListOrganisationMemberCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.organisationId}/members`);
  }

  /** @type {CcApiSimpleCommand<ListOrganisationMemberCommandInput, ListOrganisationMemberCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformOrganisationMember), 'name', 'email', 'id');
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}
