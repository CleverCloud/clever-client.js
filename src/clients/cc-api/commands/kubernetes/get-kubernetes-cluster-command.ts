import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetKubernetesClusterCommandInput,
  GetKubernetesClusterCommandOutput,
} from './get-kubernetes-cluster-command.types.js';
import { transformKubernetesCluster } from './kubernetes-transform.js';

/**
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

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetKubernetesClusterCommandOutput {
    return transformKubernetesCluster(response);
  }
}
