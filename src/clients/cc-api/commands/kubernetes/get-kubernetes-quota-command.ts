import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type {
  GetKubernetesQuotaCommandInput,
  GetKubernetesQuotaCommandOutput,
} from './get-kubernetes-quota-command.types.ts';
import { transformKubernetesQuota } from './kubernetes-transform.ts';

/**
 * Retrieves the limits applied to an owner's Kubernetes usage.
 *
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/quota
 * @group Kubernetes
 * @version 4
 */
export class GetKubernetesQuotaCommand extends CcApiSimpleCommand<
  GetKubernetesQuotaCommandInput,
  GetKubernetesQuotaCommandOutput
> {
  toRequestParams(params: GetKubernetesQuotaCommandInput) {
    return get(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/quota`);
  }

  transformCommandOutput(response: unknown): GetKubernetesQuotaCommandOutput {
    return transformKubernetesQuota(response);
  }

  // the handler writes the default quota when the owner has none yet, but it is keyed on the owner,
  // so a replay finds that row and stores nothing more
  isIdempotent(): boolean {
    return true;
  }
}
