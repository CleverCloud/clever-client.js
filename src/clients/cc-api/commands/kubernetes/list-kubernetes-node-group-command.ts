import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKubernetesNodeGroup } from './kubernetes-transform.js';
import type {
  ListKubernetesNodeGroupCommandInput,
  ListKubernetesNodeGroupCommandOutput,
} from './list-kubernetes-node-group-command.types.js';

/**
 * Lists the node groups of a Kubernetes cluster, optionally filtered by status.
 *
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX/node-groups
 * @group Kubernetes
 * @version 4
 */
export class ListKubernetesNodeGroupCommand extends CcApiSimpleCommand<
  ListKubernetesNodeGroupCommandInput,
  ListKubernetesNodeGroupCommandOutput
> {
  toRequestParams(params: ListKubernetesNodeGroupCommandInput) {
    return get(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/node-groups`,
      new QueryParams().set('status', params.status),
    );
  }

  transformCommandOutput(response: unknown): ListKubernetesNodeGroupCommandOutput {
    return (response as Array<Parameters<typeof transformKubernetesNodeGroup>[0]>).map(transformKubernetesNodeGroup);
  }

  isIdempotent(): boolean {
    return true;
  }
}
