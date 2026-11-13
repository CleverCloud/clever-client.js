import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  GetKubernetesClusterCommandInput,
  GetKubernetesClusterCommandOutput,
} from './get-kubernetes-cluster-command.types.ts';
import { transformKubernetesCluster } from './kubernetes-transform.ts';

/**
 * Retrieves one Kubernetes cluster, with its node groups and load balancers.
 *
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX
 * @group Kubernetes
 * @version 4
 */
export class GetKubernetesClusterCommand extends CcApiSimpleCommand<
  GetKubernetesClusterCommandInput,
  GetKubernetesClusterCommandOutput
> {
  toRequestParams(params: GetKubernetesClusterCommandInput) {
    return get(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}`);
  }

  transformCommandOutput(response: unknown): GetKubernetesClusterCommandOutput {
    return transformKubernetesCluster(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
