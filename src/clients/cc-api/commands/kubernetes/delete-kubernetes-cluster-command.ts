import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { DeleteKubernetesClusterCommandInput } from './delete-kubernetes-cluster-command.types.js';
import { waitForKubernetesClusterDeletion } from './kubernetes-utils.js';

/**
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
    if (params.wait) {
      await waitForKubernetesClusterDeletion(composer, params.ownerId, params.clusterId);
    }
    return undefined;
  }
}

/**
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
}
