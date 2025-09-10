/**
 * @import { GetDeploymentCommandInput, GetDeploymentCommandOutput, GetDeploymentCommandOutputLegacy } from './get-deployment-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformDeploymentLegacy } from './deployment-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetDeploymentCommandInput, GetDeploymentCommandOutput>}
 * @endpoint [GET] /v4/orchestration/organisations/:XXX/applications/:XXX/deployments/:XXX
 * @group Deployment
 * @version 4
 */
export class GetDeploymentCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetDeploymentCommandInput, GetDeploymentCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/deployments/${params.deploymentId}`,
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<GetDeploymentCommandInput, GetDeploymentCommandOutputLegacy>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/deployments/:XXX
 * @group Deployment
 * @version 2
 * @deprecated
 */
export class GetDeploymentCommandLegacy extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetDeploymentCommandInput, GetDeploymentCommandOutputLegacy>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/deployments/${params.deploymentId}`,
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetDeploymentCommandInput, GetDeploymentCommandOutputLegacy>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformDeploymentLegacy(response, this.params.applicationId);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
