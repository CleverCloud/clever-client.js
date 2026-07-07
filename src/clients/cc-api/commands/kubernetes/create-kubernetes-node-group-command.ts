import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  CreateKubernetesNodeGroupCommandInput,
  CreateKubernetesNodeGroupCommandOutput,
} from './create-kubernetes-node-group-command.types.js';
import { transformKubernetesNodeGroup } from './kubernetes-transform.js';

/**
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters/:XXX/node-groups
 * @group Kubernetes
 * @version 4
 */
export class CreateKubernetesNodeGroupCommand extends CcApiSimpleCommand<
  CreateKubernetesNodeGroupCommandInput,
  CreateKubernetesNodeGroupCommandOutput
> {
  toRequestParams(params: CreateKubernetesNodeGroupCommandInput) {
    return postJson(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/node-groups`, {
      name: params.name,
      flavor: params.flavor,
      targetNodeCount: params.targetNodeCount,
      description: params.description,
      tag: params.tag,
      minNodeCount: params.minNodeCount,
      maxNodeCount: params.maxNodeCount,
      taints: params.taints,
      labels: params.labels,
      autoscalingEnabled: params.autoscalingEnabled,
    });
  }

  transformCommandOutput(response: unknown): CreateKubernetesNodeGroupCommandOutput {
    return transformKubernetesNodeGroup(response);
  }
}
