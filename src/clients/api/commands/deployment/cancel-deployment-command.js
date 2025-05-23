/**
 * @import { CancelDeploymentCommandInput } from './cancel-deployment-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CancelDeploymentCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/deployments/:XXX/instances
 * @group Deployment
 * @version 2
 */
export class CancelDeploymentCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CancelDeploymentCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/deployments/${params.deploymentId}/instances`,
    );
  }

  /** @type {CcApiSimpleCommand<CancelDeploymentCommandInput, void>['toRequestParams']} */
  transformCommandOutput(_response) {
    return null;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
