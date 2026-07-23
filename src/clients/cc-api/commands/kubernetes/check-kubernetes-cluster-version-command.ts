import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  CheckKubernetesClusterVersionCommandInput,
  CheckKubernetesClusterVersionCommandOutput,
} from './check-kubernetes-cluster-version-command.types.js';
import { transformKubernetesClusterVersionCheck } from './kubernetes-transform.js';

/**
 * Tells whether a cluster runs the latest Kubernetes version, and which versions it can move to.
 *
 * @endpoint [GET] /v4/kubernetes/organisations/:XXX/clusters/:XXX/version/check
 * @group Kubernetes
 * @version 4
 */
export class CheckKubernetesClusterVersionCommand extends CcApiSimpleCommand<
  CheckKubernetesClusterVersionCommandInput,
  CheckKubernetesClusterVersionCommandOutput
> {
  toRequestParams(params: CheckKubernetesClusterVersionCommandInput) {
    return get(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/version/check`);
  }

  transformCommandOutput(response: unknown): CheckKubernetesClusterVersionCommandOutput {
    return transformKubernetesClusterVersionCheck(response);
  }
}
