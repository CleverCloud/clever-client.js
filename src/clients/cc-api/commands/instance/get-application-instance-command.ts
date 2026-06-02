import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetApplicationInstanceCommandInput,
  GetApplicationInstanceCommandOutput,
} from './get-application-instance-command.types.js';
import { transformApplicationInstance } from './instance-transform.js';

/**
 * @endpoint [GET] /v4/orchestration/organisations/:XXX/applications/:XXX/instances/:XXX
 * @group Instance
 * @version 4
 */
export class GetApplicationInstanceCommand extends CcApiSimpleCommand<
  GetApplicationInstanceCommandInput,
  GetApplicationInstanceCommandOutput
> {
  toRequestParams(params: GetApplicationInstanceCommandInput) {
    return get(
      safeUrl`/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances/${params.instanceId}`,
    );
  }

  transformCommandOutput(response: unknown): GetApplicationInstanceCommandOutput {
    return transformApplicationInstance(response);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
