/**
 * @import { RemoveOrganisationMemberCommandInput, RemoveOrganisationMemberCommandOutput } from './remove-organisation-member-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<RemoveOrganisationMemberCommandInput, RemoveOrganisationMemberCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX/members/:XXX
 * @group Organisation
 * @version 2
 */
export class RemoveOrganisationMemberCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RemoveOrganisationMemberCommandInput, RemoveOrganisationMemberCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/${params.organisationId}/members/${params.memberId}`);
  }

  /** @type {CcApiSimpleCommand<RemoveOrganisationMemberCommandInput, RemoveOrganisationMemberCommandOutput>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
