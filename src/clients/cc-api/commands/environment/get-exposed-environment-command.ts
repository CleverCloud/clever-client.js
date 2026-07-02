import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetExposedEnvironmentCommandInput,
  GetExposedEnvironmentCommandOutput,
} from './get-exposed-environment-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/exposed_env
 * @group Environment
 * @version 2
 */
export class GetExposedEnvironmentCommand extends CcApiSimpleCommand<
  GetExposedEnvironmentCommandInput,
  GetExposedEnvironmentCommandOutput
> {
  toRequestParams(params: GetExposedEnvironmentCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/exposed_env`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetExposedEnvironmentCommandOutput {
    return sortBy(toArray(response as Record<string, string>), 'name');
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
