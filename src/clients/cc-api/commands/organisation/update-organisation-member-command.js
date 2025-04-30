/**
 * @import { UpdateOrganisationMemberCommandInput, UpdateOrganisationMemberCommandOutput } from './update-organisation-member-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateOrganisationMemberCommandInput, UpdateOrganisationMemberCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/members/:XXX
 * @group Organisation
 * @version 2
 */
export class UpdateOrganisationMemberCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateOrganisationMemberCommandInput, UpdateOrganisationMemberCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/organisations/${params.organisationId}/members/${params.memberId}`, {
      role: params.role,
      job: params.job,
    });
  }

  /** @type {CcApiSimpleCommand<UpdateOrganisationMemberCommandInput, UpdateOrganisationMemberCommandOutput>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
