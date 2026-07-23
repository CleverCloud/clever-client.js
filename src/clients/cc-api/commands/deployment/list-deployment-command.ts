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
 * Lists the deployments of an application, or of every application of an organisation.
 *
 * The endpoint that is called depends on the input: when an `applicationId` is given, only that application's
 * deployments are listed and the paging and filtering parameters apply; otherwise every application of the
 * organisation is covered and only `ownerId` is forwarded.
 *
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
 * Lists the deployments of every application of an organisation.
 *
 * The payload groups the deployments by application, as a record keyed by application identifier; it is
 * flattened into a single array, each deployment carrying the application it belongs to.
 *
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
}

/**
 * Lists the deployments of a single application.
 *
 * The backend returns at most 10 deployments when no `limit` is given.
 *
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

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
