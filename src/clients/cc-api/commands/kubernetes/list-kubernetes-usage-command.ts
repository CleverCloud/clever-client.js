import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKubernetesClusterUsageItem } from './kubernetes-transform.js';
import type {
  ListKubernetesUsageCommandInput,
  ListKubernetesUsageCommandOutput,
} from './list-kubernetes-usage-command.types.js';

/**
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

  getEmptyResponsePolicy(status: number): { isEmpty: boolean; emptyValue?: unknown } {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  transformCommandOutput(response: unknown): ListKubernetesUsageCommandOutput {
    return (response as Array<Parameters<typeof transformKubernetesClusterUsageItem>[0]>).map(
      transformKubernetesClusterUsageItem,
    );
  }
}
