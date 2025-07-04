/**
 * @import { ListDeploymentCommandInput, ListOrganisationDeploymentCommandInput, ListApplicationDeploymentCommandInput, ListDeploymentCommandOutput } from './list-deployment-command.types.js';
 * @import { DeploymentLegacy } from './deployment.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformDeploymentLegacy } from './deployment-transform.js';

/**
 * @extends {CcApiCompositeCommand<ListDeploymentCommandInput, ListDeploymentCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/deployments
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/deployments
 * @group Deployment
 * @version 2
 */
export class ListDeploymentCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<ListDeploymentCommandInput, ListDeploymentCommandOutput>['compose']} */
  async compose(params, client) {
    if ('applicationId' in params && params.applicationId != null) {
      return client.send(new ListApplicationDeploymentCommand(params));
    }
    return client.send(new ListOrganisationDeploymentCommand({ ownerId: params.ownerId }));
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<ListOrganisationDeploymentCommandInput, Array<DeploymentLegacy>>}
 * @endpoint [GET] /v2/organisations/:XXX/deployments
 * @group Deployment
 * @version 2
 */
class ListOrganisationDeploymentCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListOrganisationDeploymentCommandInput, Array<DeploymentLegacy>>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/deployments`);
  }

  /** @type {CcApiSimpleCommand<ListOrganisationDeploymentCommandInput, Array<DeploymentLegacy>>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return Object.entries(response).flatMap(([applicationId, deployments]) =>
      deployments.map(/** @param {any} o */ (o) => transformDeploymentLegacy(o, applicationId)),
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<ListApplicationDeploymentCommandInput, Array<DeploymentLegacy>>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/deployments
 * @group Deployment
 * @version 2
 */
class ListApplicationDeploymentCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListApplicationDeploymentCommandInput, Array<DeploymentLegacy>>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/deployments`,
      new QueryParams().set('limit', params.limit).set('offset', params.offset).set('action', params.action),
    );
  }

  /** @type {CcApiSimpleCommand<ListApplicationDeploymentCommandInput, Array<DeploymentLegacy>>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.map(/** @param {any} o */ (o) => transformDeploymentLegacy(o, this.params.applicationId));
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
