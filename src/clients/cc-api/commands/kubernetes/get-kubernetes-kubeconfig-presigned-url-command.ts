import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetKubernetesKubeconfigPresignedUrlCommandInput,
  GetKubernetesKubeconfigPresignedUrlCommandOutput,
} from './get-kubernetes-kubeconfig-presigned-url-command.types.js';

/**
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX/kubeconfig/presigned-url
 * @group Kubernetes
 * @version 4
 */
export class GetKubernetesKubeconfigPresignedUrlCommand extends CcApiSimpleCommand<
  GetKubernetesKubeconfigPresignedUrlCommandInput,
  GetKubernetesKubeconfigPresignedUrlCommandOutput
> {
  toRequestParams(params: GetKubernetesKubeconfigPresignedUrlCommandInput) {
    return get(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/kubeconfig/presigned-url`,
    );
  }
}
