import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformDeployment, transformDeploymentLegacy } from './deployment-transform.ts';
import type {
  GetDeploymentCommandInput,
  GetDeploymentCommandOutput,
  GetDeploymentCommandOutputLegacy,
} from './get-deployment-command.types.ts';

/**
 * Retrieves a deployment of an application, with the states it went through and what triggered it.
 *
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

  transformCommandOutput(response: unknown): GetDeploymentCommandOutput {
    return transformDeployment(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Retrieves a deployment of an application from the legacy v2 API.
 *
 * The v2 shape is flatter than the v4 one: it carries the deployment number and its author, but not the steps
 * or the placement details. Prefer `GetDeploymentCommand`.
 *
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

  transformCommandOutput(response: unknown): GetDeploymentCommandOutputLegacy {
    return transformDeploymentLegacy(response, this.params.applicationId);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
