import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKubernetesDeploymentEvent } from './kubernetes-transform.js';
import type {
  ListKubernetesDeploymentEventCommandInput,
  ListKubernetesDeploymentEventCommandOutput,
} from './list-kubernetes-deployment-event-command.types.js';

/**
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX/deployment-events
 * @group Kubernetes
 * @version 4
 */
export class ListKubernetesDeploymentEventCommand extends CcApiSimpleCommand<
  ListKubernetesDeploymentEventCommandInput,
  ListKubernetesDeploymentEventCommandOutput
> {
  toRequestParams(params: ListKubernetesDeploymentEventCommandInput) {
    return get(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/deployment-events`,
      new QueryParams().set('limit', params.limit),
    );
  }

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  transformCommandOutput(response: unknown): ListKubernetesDeploymentEventCommandOutput {
    return (response as Array<Parameters<typeof transformKubernetesDeploymentEvent>[0]>).map(
      transformKubernetesDeploymentEvent,
    );
  }
}
