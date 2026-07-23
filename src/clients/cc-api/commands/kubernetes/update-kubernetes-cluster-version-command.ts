import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { transformKubernetesCluster } from './kubernetes-transform.js';
import { waitForKubernetesClusterActive } from './kubernetes-utils.js';
import type {
  UpdateKubernetesClusterVersionCommandInput,
  UpdateKubernetesClusterVersionCommandOutput,
} from './update-kubernetes-cluster-version-command.types.js';

/**
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters/:XXX/version/update
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX
 * @group Kubernetes
 * @version 4
 */
export class UpdateKubernetesClusterVersionCommand extends CcApiCompositeCommand<
  UpdateKubernetesClusterVersionCommandInput,
  UpdateKubernetesClusterVersionCommandOutput
> {
  async compose(
    params: UpdateKubernetesClusterVersionCommandInput,
    composer: CcApiComposer,
  ): Promise<UpdateKubernetesClusterVersionCommandOutput> {
    const cluster = await composer.send(new UpdateKubernetesClusterVersionCommandInner(params));
    if (params.shouldWaitForActive) {
      return waitForKubernetesClusterActive(composer, params.ownerId, params.clusterId);
    }
    return cluster;
  }
}

/**
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters/:XXX/version/update
 * @group Kubernetes
 * @version 4
 */
class UpdateKubernetesClusterVersionCommandInner extends CcApiSimpleCommand<
  UpdateKubernetesClusterVersionCommandInput,
  UpdateKubernetesClusterVersionCommandOutput
> {
  toRequestParams(params: UpdateKubernetesClusterVersionCommandInput) {
    return postJson(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/version/update`,
      {
        targetVersion: params.targetVersion,
      },
    );
  }

  transformCommandOutput(response: unknown): UpdateKubernetesClusterVersionCommandOutput {
    return transformKubernetesCluster(response);
  }
}
