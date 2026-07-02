import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformDeploymentLegacy } from './deployment-transform.js';
import type { DeploymentLegacy } from './deployment.types.js';
import type {
  ListApplicationDeploymentCommandInput,
  ListDeploymentCommandInput,
  ListDeploymentCommandOutput,
  ListOrganisationDeploymentCommandInput,
} from './list-deployment-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/deployments
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/deployments
 * @group Deployment
 * @version 2
 */
export class ListDeploymentCommand extends CcApiCompositeCommand<
  ListDeploymentCommandInput,
  ListDeploymentCommandOutput
> {
  async compose(params: ListDeploymentCommandInput, client: CcApiComposer): Promise<ListDeploymentCommandOutput> {
    if ('applicationId' in params && params.applicationId != null) {
      return client.send(new ListApplicationDeploymentCommand(params));
    }
    return client.send(new ListOrganisationDeploymentCommand({ ownerId: params.ownerId! }));
  }
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/deployments
 * @group Deployment
 * @version 2
 */
class ListOrganisationDeploymentCommand extends CcApiSimpleCommand<
  ListOrganisationDeploymentCommandInput,
  Array<DeploymentLegacy>
> {
  toRequestParams(params: ListOrganisationDeploymentCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/deployments`);
  }

  transformCommandOutput(response: unknown): Array<DeploymentLegacy> {
    return Object.entries(response as Record<string, Array<unknown>>).flatMap(([applicationId, deployments]) =>
      deployments.map((o) => transformDeploymentLegacy(o, applicationId)),
    );
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/deployments
 * @group Deployment
 * @version 2
 */
class ListApplicationDeploymentCommand extends CcApiSimpleCommand<
  ListApplicationDeploymentCommandInput,
  Array<DeploymentLegacy>
> {
  toRequestParams(params: ListApplicationDeploymentCommandInput) {
    return get(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/deployments`,
      new QueryParams().set('limit', params.limit).set('offset', params.offset).set('action', params.action),
    );
  }

  transformCommandOutput(response: unknown): Array<DeploymentLegacy> {
    return (response as Array<unknown>).map((o) => transformDeploymentLegacy(o, this.params.applicationId));
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
