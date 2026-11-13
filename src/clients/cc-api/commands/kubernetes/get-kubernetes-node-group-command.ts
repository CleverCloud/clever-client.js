import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  GetKubernetesNodeGroupCommandInput,
  GetKubernetesNodeGroupCommandOutput,
} from './get-kubernetes-node-group-command.types.ts';
import { transformKubernetesNodeGroup } from './kubernetes-transform.ts';

/**
 * Retrieves one node group of a cluster.
 *
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX/node-groups/:XXX
 * @group Kubernetes
 * @version 4
 */
export class GetKubernetesNodeGroupCommand extends CcApiSimpleCommand<
  GetKubernetesNodeGroupCommandInput,
  GetKubernetesNodeGroupCommandOutput
> {
  toRequestParams(params: GetKubernetesNodeGroupCommandInput) {
    return get(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/node-groups/${params.nodeGroupId}`,
    );
  }

  transformCommandOutput(response: unknown): GetKubernetesNodeGroupCommandOutput {
    return transformKubernetesNodeGroup(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
