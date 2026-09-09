import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { DeleteKubernetesClusterCommandInput } from './delete-kubernetes-cluster-command.types.js';
import { waitForKubernetesClusterDeletion } from './kubernetes-utils.js';

/**
 * Deletes a Kubernetes cluster, tearing down its control plane and every node it runs.
 *
 * Tearing down real machines takes several minutes. The command returns as soon as the deletion is
 * accepted, unless it is asked to wait for it to complete.
 *
 * @endpoint [DELETE] /v4/kubernetes/organisations/:XXX/clusters/:XXX
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX
 * @group Kubernetes
 * @version 4
 */
export class DeleteKubernetesClusterCommand extends CcApiCompositeCommand<
  DeleteKubernetesClusterCommandInput,
  undefined
> {
  async compose(params: DeleteKubernetesClusterCommandInput, composer: CcApiComposer): Promise<undefined> {
    await composer.send(new DeleteKubernetesClusterCommandInner(params));
    if (params.shouldWait) {
      await waitForKubernetesClusterDeletion(composer, params.ownerId, params.clusterId);
    }
    return undefined;
  }

  // the deletion below converges and the wait only reads, so replaying the whole thing is safe
  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Asks for the cluster to be deleted, without waiting for it to be gone.
 *
 * @endpoint [DELETE] /v4/kubernetes/organisations/:XXX/clusters/:XXX
 * @group Kubernetes
 * @version 4
 */
class DeleteKubernetesClusterCommandInner extends CcApiSimpleCommand<DeleteKubernetesClusterCommandInput, undefined> {
  toRequestParams(params: DeleteKubernetesClusterCommandInput) {
    return delete_(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}`);
  }

  // The API actually returns the cluster's transitional state (TO_DELETE/DELETING), but every Delete
  // command in this client discards the response body, so we follow that convention here too.
  transformCommandOutput(): undefined {
    return undefined;
  }

  // the handler only flags the cluster for deletion, and returns it untouched when the flag is
  // already set, so a replay tears down nothing more
  isIdempotent(): boolean {
    return true;
  }
}
