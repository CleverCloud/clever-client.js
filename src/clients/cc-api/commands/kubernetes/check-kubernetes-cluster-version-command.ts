import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  CheckKubernetesClusterVersionCommandInput,
  CheckKubernetesClusterVersionCommandOutput,
} from './check-kubernetes-cluster-version-command.types.js';

/**
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
    const res = response as CheckKubernetesClusterVersionCommandOutput;
    return {
      installed: res.installed,
      available: res.available,
      latest: res.latest,
      needUpdate: res.needUpdate,
    };
  }
}
