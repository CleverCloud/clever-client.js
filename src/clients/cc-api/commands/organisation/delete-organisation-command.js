/**
 * @import { DeleteOrganisationCommandInput } from './delete-organisation-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteOrganisationCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX
 * @group Organisation
 * @version 2
 */
export class DeleteOrganisationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteOrganisationCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    if (params.organisationId?.startsWith('user_')) {
      throw new Error(`Cannot delete user organisation ${params.organisationId}`);
    }
    return delete_(safeUrl`/v2/organisations/${params.organisationId}`);
  }

  /** @type {CcApiSimpleCommand<DeleteOrganisationCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
