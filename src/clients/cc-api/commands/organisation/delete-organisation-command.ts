import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteOrganisationCommandInput } from './delete-organisation-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX
 * @group Organisation
 * @version 2
 */
export class DeleteOrganisationCommand extends CcApiSimpleCommand<DeleteOrganisationCommandInput, void> {
  toRequestParams(params: DeleteOrganisationCommandInput) {
    if (params.organisationId?.startsWith('user_')) {
      throw new Error(`Cannot delete user organisation ${params.organisationId}`);
    }
    return delete_(safeUrl`/v2/organisations/${params.organisationId}`);
  }

  transformCommandOutput(): void {
    return null;
  }
}
