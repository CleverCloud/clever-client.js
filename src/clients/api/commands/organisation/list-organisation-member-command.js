/**
 * @import { ListOrganisationMemberCommandInput, ListOrganisationMemberCommandOutput } from './list-organisation-member-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

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
    return get(safeUrl`/v2/organisations/:XXX/members`);
  }

  /** @type {CcApiSimpleCommand<ListOrganisationMemberCommandInput, ListOrganisationMemberCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
