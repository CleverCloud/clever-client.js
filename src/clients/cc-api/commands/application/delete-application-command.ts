import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteApplicationCommandInput } from './delete-application-command.types.js';

/**
 * Deletes an application, along with its deployment repository and its configuration.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX
 * @group Application
 * @version 2
 */
export class DeleteApplicationCommand extends CcApiSimpleCommand<DeleteApplicationCommandInput, undefined> {
  toRequestParams(params: DeleteApplicationCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  // a deleted application is skipped by the owner lookup, so a replay answers 404 without deleting
  // anything again
  isIdempotent(): boolean {
    return true;
  }
}
