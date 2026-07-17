import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKubernetesCluster } from './kubernetes-transform.js';
import type {
  ListKubernetesClusterCommandInput,
  ListKubernetesClusterCommandOutput,
} from './list-kubernetes-cluster-command.types.js';

/**
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters
 * @group Kubernetes
 * @version 4
 */
export class ListKubernetesClusterCommand extends CcApiSimpleCommand<
  ListKubernetesClusterCommandInput,
  ListKubernetesClusterCommandOutput
> {
  toRequestParams(params: ListKubernetesClusterCommandInput) {
    return get(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters`,
      new QueryParams().set('status', params.status),
    );
  }

  transformCommandOutput(response: unknown): ListKubernetesClusterCommandOutput {
    return (response as Array<Parameters<typeof transformKubernetesCluster>[0]>).map(transformKubernetesCluster);
  }
}
