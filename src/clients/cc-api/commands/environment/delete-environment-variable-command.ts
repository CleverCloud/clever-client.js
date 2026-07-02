import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  DeleteEnvironmentVariableCommandInput,
  DeleteEnvironmentVariableCommandOutput,
} from './delete-environment-variable-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/env/:XXX
 * @group Environment
 * @version 2
 */
export class DeleteEnvironmentVariableCommand extends CcApiSimpleCommand<
  DeleteEnvironmentVariableCommandInput,
  DeleteEnvironmentVariableCommandOutput
> {
  toRequestParams(params: DeleteEnvironmentVariableCommandInput) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env/${params.name}`,
    );
  }

  transformCommandOutput(response: unknown): DeleteEnvironmentVariableCommandOutput {
    return sortBy((response as { env: DeleteEnvironmentVariableCommandOutput }).env, 'name');
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
