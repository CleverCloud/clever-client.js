import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  RemoveOrganisationMemberCommandInput,
  RemoveOrganisationMemberCommandOutput,
} from './remove-organisation-member-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/members/:XXX
 * @group Organisation
 * @version 2
 */
export class RemoveOrganisationMemberCommand extends CcApiSimpleCommand<
  RemoveOrganisationMemberCommandInput,
  RemoveOrganisationMemberCommandOutput
> {
  toRequestParams(params: RemoveOrganisationMemberCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.organisationId}/members/${params.memberId}`);
  }

  transformCommandOutput(): RemoveOrganisationMemberCommandOutput {
    return null;
  }
}
