import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformDeploymentLegacy } from './deployment-transform.js';
import type {
  GetDeploymentCommandInput,
  GetDeploymentCommandOutput,
  GetDeploymentCommandOutputLegacy,
} from './get-deployment-command.types.js';

/**
 * @endpoint [GET] /v4/orchestration/organisations/:XXX/applications/:XXX/deployments/:XXX
 * @group Deployment
 * @version 4
 */
export class GetDeploymentCommand extends CcApiSimpleCommand<GetDeploymentCommandInput, GetDeploymentCommandOutput> {
  toRequestParams(params: GetDeploymentCommandInput) {
    return get(
      safeUrl`/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/deployments/${params.deploymentId}`,
    );
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

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/deployments/:XXX
 * @group Deployment
 * @version 2
 * @deprecated
 */
export class GetDeploymentCommandLegacy extends CcApiSimpleCommand<
  GetDeploymentCommandInput,
  GetDeploymentCommandOutputLegacy
> {
  toRequestParams(params: GetDeploymentCommandInput) {
    return get(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/deployments/${params.deploymentId}`,
    );
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetDeploymentCommandOutputLegacy {
    return transformDeploymentLegacy(response, this.params.applicationId);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
