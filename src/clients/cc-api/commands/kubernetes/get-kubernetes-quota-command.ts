import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetKubernetesQuotaCommandInput,
  GetKubernetesQuotaCommandOutput,
} from './get-kubernetes-quota-command.types.js';
import { transformKubernetesQuota } from './kubernetes-transform.js';

/**
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
}
