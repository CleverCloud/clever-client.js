import { patchJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKubernetesNodeGroup } from './kubernetes-transform.js';
import type {
  UpdateKubernetesNodeGroupCommandInput,
  UpdateKubernetesNodeGroupCommandOutput,
} from './update-kubernetes-node-group-command.types.js';

/**
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
        autoscalingEnabled: params.autoscalingEnabled,
      },
    );
  }

  transformCommandOutput(response: unknown): UpdateKubernetesNodeGroupCommandOutput {
    return transformKubernetesNodeGroup(response);
  }
}
