import { patchJson } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import { serializeKubernetesClusterFeatures, transformKubernetesCluster } from './kubernetes-transform.ts';
import type {
  UpdateKubernetesClusterCommandInput,
  UpdateKubernetesClusterCommandOutput,
} from './update-kubernetes-cluster-command.types.ts';

/**
 * Updates the metadata and the optional capabilities of a Kubernetes cluster.
 *
 * Only the fields that are set are changed; the others are left as they are. Sizing, version and
 * location are not patchable here.
 *
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
      features: serializeKubernetesClusterFeatures(params.features),
    });
  }

  transformCommandOutput(response: unknown): UpdateKubernetesClusterCommandOutput {
    return transformKubernetesCluster(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
