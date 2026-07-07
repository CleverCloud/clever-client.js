import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { transformKubernetesCluster } from './kubernetes-transform.js';
import { waitForKubernetesClusterActive } from './kubernetes-utils.js';
import type {
  ResumeKubernetesClusterCommandInput,
  ResumeKubernetesClusterCommandOutput,
} from './resume-kubernetes-cluster-command.types.js';

/**
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters/:XXX/resume
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX
 * @group Kubernetes
 * @version 4
 */
export class ResumeKubernetesClusterCommand extends CcApiCompositeCommand<
  ResumeKubernetesClusterCommandInput,
  ResumeKubernetesClusterCommandOutput
> {
  async compose(
    params: ResumeKubernetesClusterCommandInput,
    composer: CcApiComposer,
  ): Promise<ResumeKubernetesClusterCommandOutput> {
    const cluster = await composer.send(new ResumeKubernetesClusterCommandInner(params));
    if (params.waitForActive) {
      return waitForKubernetesClusterActive(composer, params.ownerId, params.clusterId);
    }
    return cluster;
  }
}

/**
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters/:XXX/resume
 * @group Kubernetes
 * @version 4
 */
class ResumeKubernetesClusterCommandInner extends CcApiSimpleCommand<
  ResumeKubernetesClusterCommandInput,
  ResumeKubernetesClusterCommandOutput
> {
  toRequestParams(params: ResumeKubernetesClusterCommandInput) {
    return post(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/resume`);
  }

  transformCommandOutput(response: unknown): ResumeKubernetesClusterCommandOutput {
    return transformKubernetesCluster(response);
  }
}
