import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetKubernetesNodeGroupCommandInput,
  GetKubernetesNodeGroupCommandOutput,
} from './get-kubernetes-node-group-command.types.js';
import { transformKubernetesNodeGroup } from './kubernetes-transform.js';

/**
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

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetKubernetesNodeGroupCommandOutput {
    return transformKubernetesNodeGroup(response);
  }
}
