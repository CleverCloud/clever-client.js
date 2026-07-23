import { patchJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKubernetesNodeGroup } from './kubernetes-transform.js';
import type {
  UpdateKubernetesNodeGroupCommandInput,
  UpdateKubernetesNodeGroupCommandOutput,
} from './update-kubernetes-node-group-command.types.js';

/**
 * Updates a node group: its metadata, how many nodes it runs, and its autoscaling bounds.
 *
 * Despite being a PATCH, the API requires `name` and `targetNodeCount` on every call. Resizing boots
 * or drains real machines, so the new node count is only reached some time after the call returns.
 *
 * @endpoint [PATCH] /v4/kubernetes/organisations/:XXX/clusters/:XXX/node-groups/:XXX
 * @group Kubernetes
 * @version 4
 */
export class UpdateKubernetesNodeGroupCommand extends CcApiSimpleCommand<
  UpdateKubernetesNodeGroupCommandInput,
  UpdateKubernetesNodeGroupCommandOutput
> {
  toRequestParams(params: UpdateKubernetesNodeGroupCommandInput) {
    return patchJson(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/node-groups/${params.nodeGroupId}`,
      {
        name: params.name,
        targetNodeCount: params.targetNodeCount,
        description: params.description,
        tag: params.tag,
        minNodeCount: params.minNodeCount,
        maxNodeCount: params.maxNodeCount,
        autoscalingEnabled: params.isAutoscalingEnabled,
      },
    );
  }

  transformCommandOutput(response: unknown): UpdateKubernetesNodeGroupCommandOutput {
    return transformKubernetesNodeGroup(response);
  }
}
