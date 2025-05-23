/**
 * @import { DeleteOrganisationCommandInput, DeleteOrganisationCommandOutput } from './delete-organisation-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteOrganisationCommandInput, DeleteOrganisationCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX
 * @group Organisation
 * @version 2
 */
export class DeleteOrganisationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteOrganisationCommandInput, DeleteOrganisationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/:XXX`);
  }
}
