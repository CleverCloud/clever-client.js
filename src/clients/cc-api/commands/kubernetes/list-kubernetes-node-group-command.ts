import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import { transformKubernetesNodeGroup } from './kubernetes-transform.ts';
import type {
  ListKubernetesNodeGroupCommandInput,
  ListKubernetesNodeGroupCommandOutput,
} from './list-kubernetes-node-group-command.types.ts';

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
