import { postJson } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  CreateKubernetesNodeGroupCommandInput,
  CreateKubernetesNodeGroupCommandOutput,
} from './create-kubernetes-node-group-command.types.ts';
import { transformKubernetesNodeGroup } from './kubernetes-transform.ts';

/**
 * Adds a node group to an existing Kubernetes cluster.
 *
 * The nodes are booted asynchronously: the node group comes back in a pending state and only reaches
 * its target node count once every machine has joined the cluster.
 *
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
      autoscalingEnabled: params.isAutoscalingEnabled,
    });
  }

  transformCommandOutput(response: unknown): CreateKubernetesNodeGroupCommandOutput {
    return transformKubernetesNodeGroup(response);
  }

  // nothing dedupes on the name: each call mints a node group id and reserves quota for it, so a
  // replay adds a second node group and boots its machines
  isIdempotent(): boolean {
    return false;
  }
}
