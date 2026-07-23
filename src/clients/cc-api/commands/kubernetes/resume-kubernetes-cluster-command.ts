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
 * Resumes a cluster stuck in the `FAILED` status, re-running the operation that failed.
 *
 * Only a `FAILED` cluster can be resumed, and one that failed while being deleted cannot: ask for the
 * deletion again instead. Recovery boots real machines and takes several minutes; the command returns
 * as soon as it is accepted, unless it is asked to wait for the cluster to become active.
 *
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
    if (params.shouldWaitForActive) {
      return waitForKubernetesClusterActive(composer, params.ownerId, params.clusterId);
    }
    return cluster;
  }
}

/**
 * Asks for the cluster to be resumed, without waiting for it to recover.
 *
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
