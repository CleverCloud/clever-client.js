/**
 * @import { AddOrganisationMemberCommandInput, AddOrganisationMemberCommandOutput } from './add-organisation-member-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<AddOrganisationMemberCommandInput, AddOrganisationMemberCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/members
 * @group Organisation
 * @version 2
 */
export class AddOrganisationMemberCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<AddOrganisationMemberCommandInput, AddOrganisationMemberCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v2/organisations/:XXX/members`, {});
  }
}
