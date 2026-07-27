import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKubernetesClusterEvent } from './kubernetes-transform.js';
import type {
  ListKubernetesClusterEventCommandInput,
  ListKubernetesClusterEventCommandOutput,
} from './list-kubernetes-cluster-event-command.types.js';

/**
 * Lists the event log of a cluster: its cluster-level status transitions, the changes to the
 * infrastructure resources backing it, and its node-level lifecycle signals.
 *
 * The API returns the most recent events first, capped at 50 by default and 1000 at most.
 *
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX/events
 * @group Kubernetes
 * @version 4
 */
export class ListKubernetesClusterEventCommand extends CcApiSimpleCommand<
  ListKubernetesClusterEventCommandInput,
  ListKubernetesClusterEventCommandOutput
> {
  toRequestParams(params: ListKubernetesClusterEventCommandInput) {
    return get(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/events`,
      new QueryParams().set('limit', params.limit),
    );
  }

  transformCommandOutput(response: unknown): ListKubernetesClusterEventCommandOutput {
    return (response as Array<unknown>).map(transformKubernetesClusterEvent);
  }
}
