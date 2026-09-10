import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  GetKubernetesKubeconfigPresignedUrlCommandInput,
  GetKubernetesKubeconfigPresignedUrlCommandOutput,
} from './get-kubernetes-kubeconfig-presigned-url-command.types.js';

/**
 * Retrieves a self-authenticated URL from which the cluster's kubeconfig can be downloaded.
 *
 * The URL carries its own token, so it can be handed to a tool that has no Clever Cloud credentials.
 * It only grants a read of that one kubeconfig, and expires an hour after it was issued.
 *
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

  transformCommandOutput(response: unknown): GetKubernetesKubeconfigPresignedUrlCommandOutput {
    const payload = response as { url: string };
    return {
      url: payload.url,
    };
  }

  // the token is signed on the fly for each call and never stored, so a replay issues another URL
  // without touching the cluster or invalidating the first one
  isIdempotent(): boolean {
    return true;
  }
}
