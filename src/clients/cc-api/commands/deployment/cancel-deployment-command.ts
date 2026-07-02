import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { CancelDeploymentCommandInput } from './cancel-deployment-command.types.js';

/**
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
