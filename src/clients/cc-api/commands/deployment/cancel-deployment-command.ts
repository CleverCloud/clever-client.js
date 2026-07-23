import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { CancelDeploymentCommandInput } from './cancel-deployment-command.types.js';

/**
 * Cancels an in-flight deployment of an application.
 *
 * Cancellation works by destroying the instances the deployment has already started. It only makes sense on a
 * deployment that is still running: a deployment that already reached a terminal state is left untouched.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/deployments/:XXX/instances
 * @group Deployment
 * @version 2
 */
export class CancelDeploymentCommand extends CcApiSimpleCommand<CancelDeploymentCommandInput, undefined> {
  toRequestParams(params: CancelDeploymentCommandInput) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/deployments/${params.deploymentId}/instances`,
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
