import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { UpdateOrganisationMemberCommandInput } from './update-organisation-member-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/members/:XXX
 * @group Organisation
 * @version 2
 */
export class UpdateOrganisationMemberCommand extends CcApiSimpleCommand<UpdateOrganisationMemberCommandInput, void> {
  toRequestParams(params: UpdateOrganisationMemberCommandInput) {
    return put(safeUrl`/v2/organisations/${params.organisationId}/members/${params.memberId}`, {
      role: params.role,
      job: params.job,
    });
  }

  transformCommandOutput(): void {
    return null;
  }
}
