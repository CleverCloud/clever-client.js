import { postJson } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type {
  CreateKubernetesClusterCommandInput,
  CreateKubernetesClusterCommandOutput,
} from './create-kubernetes-cluster-command.types.js';
import { transformKubernetesCluster } from './kubernetes-transform.js';
import { waitForKubernetesClusterActive } from './kubernetes-utils.js';

/**
 * Creates a Kubernetes cluster, optionally with its first node groups.
 *
 * Provisioning boots real machines and takes several minutes. The command returns as soon as the
 * cluster is registered, unless it is asked to wait for it to become active.
 *
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX
 * @group Kubernetes
 * @version 4
 */
export class CreateKubernetesClusterCommand extends CcApiCompositeCommand<
  CreateKubernetesClusterCommandInput,
  CreateKubernetesClusterCommandOutput
> {
  async compose(
    params: CreateKubernetesClusterCommandInput,
    composer: CcApiComposer,
  ): Promise<CreateKubernetesClusterCommandOutput> {
    const cluster = await composer.send(new CreateKubernetesClusterCommandInner(params));
    if (params.shouldWaitForActive) {
      return waitForKubernetesClusterActive(composer, params.ownerId, cluster.id);
    }
    return cluster;
  }
}

/**
 * Registers the cluster, without waiting for it to be provisioned.
 *
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters
 * @group Kubernetes
 * @version 4
 */
class CreateKubernetesClusterCommandInner extends CcApiSimpleCommand<
  CreateKubernetesClusterCommandInput,
  CreateKubernetesClusterCommandOutput
> {
  toRequestParams(params: CreateKubernetesClusterCommandInput) {
    return postJson(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters`, {
      name: params.name,
      version: params.version,
      description: params.description,
      tags: params.tags,
      networkGroupId: params.networkGroupId,
      topologyConfig: params.topologyConfig,
      locationId: params.locationId,
      features: params.features,
      nodeGroups: params.nodeGroups,
    });
  }

  transformCommandOutput(response: unknown): CreateKubernetesClusterCommandOutput {
    return transformKubernetesCluster(response);
  }
}
