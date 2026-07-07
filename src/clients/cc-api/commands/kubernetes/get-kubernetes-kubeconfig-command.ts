import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { QueryParams } from '../../../../lib/request/query-params.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import type { SelfOrPromise } from '../../../../types/utils.types.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetKubernetesKubeconfigCommandInput,
  GetKubernetesKubeconfigCommandOutput,
} from './get-kubernetes-kubeconfig-command.types.js';

/**
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX/kubeconfig.yaml
 * @group Kubernetes
 * @version 4
 */
export class GetKubernetesKubeconfigCommand extends CcApiSimpleCommand<
  GetKubernetesKubeconfigCommandInput,
  GetKubernetesKubeconfigCommandOutput
> {
  toRequestParams(params: GetKubernetesKubeconfigCommandInput): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/kubeconfig.yaml`,
      queryParams: new QueryParams().set('type', params.kubeConfigType),
      headers: new HeadersBuilder().accept('application/yaml').build(),
    };
  }

  transformCommandOutput(response: unknown): SelfOrPromise<GetKubernetesKubeconfigCommandOutput> {
    if (typeof response === 'string') {
      return response;
    }
    return (response as Blob).text();
  }
}
