import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteKubernetesNodeGroupCommandInput } from './delete-kubernetes-node-group-command.types.js';

/**
 * @endpoint [DELETE] /v4/kubernetes/organisations/:XXX/clusters/:XXX/node-groups/:XXX
 * @group Kubernetes
 * @version 4
 */
export class DeleteKubernetesNodeGroupCommand extends CcApiSimpleCommand<
  DeleteKubernetesNodeGroupCommandInput,
  undefined
> {
  toRequestParams(params: DeleteKubernetesNodeGroupCommandInput) {
    return delete_(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/node-groups/${params.nodeGroupId}`,
    );
  }

  // The API actually returns the node group's transitional state (TERMINATING), but every Delete command
  // in this client discards the response body, so we follow that convention here too (see #6's rationale).
  transformCommandOutput(): undefined {
    return undefined;
  }
}
