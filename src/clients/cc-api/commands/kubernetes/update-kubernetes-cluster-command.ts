import { patchJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKubernetesCluster } from './kubernetes-transform.js';
import type {
  UpdateKubernetesClusterCommandInput,
  UpdateKubernetesClusterCommandOutput,
} from './update-kubernetes-cluster-command.types.js';

/**
 * @endpoint [PATCH] /v4/kubernetes/organisations/:XXX/clusters/:XXX
 * @group Kubernetes
 * @version 4
 */
export class UpdateKubernetesClusterCommand extends CcApiSimpleCommand<
  UpdateKubernetesClusterCommandInput,
  UpdateKubernetesClusterCommandOutput
> {
  toRequestParams(params: UpdateKubernetesClusterCommandInput) {
    return patchJson(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}`, {
      name: params.name,
      tags: params.tags,
      description: params.description,
      features: params.features,
    });
  }

  transformCommandOutput(response: unknown): UpdateKubernetesClusterCommandOutput {
    return transformKubernetesCluster(response);
  }
}
