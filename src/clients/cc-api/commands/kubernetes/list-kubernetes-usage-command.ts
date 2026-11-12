import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import { transformKubernetesClusterUsageItem } from './kubernetes-transform.ts';
import type {
  ListKubernetesUsageCommandInput,
  ListKubernetesUsageCommandOutput,
} from './list-kubernetes-usage-command.types.ts';

/**
 * Lists the billable Kubernetes resources an owner held, past and present.
 *
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/usage
 * @group Kubernetes
 * @version 4
 */
export class ListKubernetesUsageCommand extends CcApiSimpleCommand<
  ListKubernetesUsageCommandInput,
  ListKubernetesUsageCommandOutput
> {
  toRequestParams(params: ListKubernetesUsageCommandInput) {
    return get(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/usage`);
  }

  transformCommandOutput(response: unknown): ListKubernetesUsageCommandOutput {
    return (response as Array<Parameters<typeof transformKubernetesClusterUsageItem>[0]>).map(
      transformKubernetesClusterUsageItem,
    );
  }

  // reads what was already recorded, it bills nothing by itself
  isIdempotent(): boolean {
    return true;
  }
}
