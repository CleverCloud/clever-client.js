import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { transformKubernetesCluster } from './kubernetes-transform.js';
import { waitForKubernetesClusterActive } from './kubernetes-utils.js';
import type {
  RedeployKubernetesClusterCommandInput,
  RedeployKubernetesClusterCommandOutput,
} from './redeploy-kubernetes-cluster-command.types.js';

/**
 * Redeploys the control plane of a cluster, replacing its machines with fresh ones.
 *
 * Optional YAML hooks can be applied before and after the swap. Replacing real machines takes several
 * minutes; the command returns as soon as the redeploy is accepted, unless it is asked to wait for
 * the cluster to be active again.
 *
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters/:XXX/redeploy
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX
 * @group Kubernetes
 * @version 4
 */
export class RedeployKubernetesClusterCommand extends CcApiCompositeCommand<
  RedeployKubernetesClusterCommandInput,
  RedeployKubernetesClusterCommandOutput
> {
  async compose(
    params: RedeployKubernetesClusterCommandInput,
    composer: CcApiComposer,
  ): Promise<RedeployKubernetesClusterCommandOutput> {
    const cluster = await composer.send(new RedeployKubernetesClusterCommandInner(params));
    if (params.shouldWaitForActive) {
      return waitForKubernetesClusterActive(composer, params.ownerId, params.clusterId);
    }
    return cluster;
  }
}

/**
 * Asks for the control plane to be redeployed, without waiting for it to come back up.
 *
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters/:XXX/redeploy
 * @group Kubernetes
 * @version 4
 */
class RedeployKubernetesClusterCommandInner extends CcApiSimpleCommand<
  RedeployKubernetesClusterCommandInput,
  RedeployKubernetesClusterCommandOutput
> {
  toRequestParams(params: RedeployKubernetesClusterCommandInput) {
    return postJson(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/redeploy`, {
      beforeYamls: params.beforeYamls,
      afterYamls: params.afterYamls,
    });
  }

  transformCommandOutput(response: unknown): RedeployKubernetesClusterCommandOutput {
    return transformKubernetesCluster(response);
  }
}
