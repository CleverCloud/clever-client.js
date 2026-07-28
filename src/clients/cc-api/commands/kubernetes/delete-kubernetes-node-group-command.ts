import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { DeleteKubernetesNodeGroupCommandInput } from './delete-kubernetes-node-group-command.types.js';

/**
 * Deletes a node group of a cluster, draining and tearing down every node it runs.
 *
 * The teardown is asynchronous: the command returns as soon as the deletion is accepted, while the
 * node group goes through its terminating statuses.
 *
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

  // a node group already on its way out is returned untouched, so a replay releases no quota twice
  // and tears down nothing more
  isIdempotent(): boolean {
    return true;
  }
}
