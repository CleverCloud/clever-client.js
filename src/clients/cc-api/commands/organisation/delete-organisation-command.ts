import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { DeleteOrganisationCommandInput } from './delete-organisation-command.types.ts';

/**
 * Deletes an organisation.
 *
 * A personal organisation cannot be deleted: the command throws before sending anything when the
 * given id starts with `user_`.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX
 * @group Organisation
 * @version 2
 */
export class DeleteOrganisationCommand extends CcApiSimpleCommand<DeleteOrganisationCommandInput, undefined> {
  toRequestParams(params: DeleteOrganisationCommandInput) {
    if (params.organisationId?.startsWith('user_')) {
      throw new Error(`Cannot delete user organisation ${params.organisationId}`);
    }
    return delete_(safeUrl`/v2/organisations/${params.organisationId}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // the applications, the add-ons and the organisation are deleted, so a replay only meets a not-found error
  isIdempotent(): boolean {
    return true;
  }
}
