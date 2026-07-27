import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type {
  AddKubernetesPersistentStorageCommandInput,
  AddKubernetesPersistentStorageCommandOutput,
} from './add-kubernetes-persistent-storage-command.types.js';
import { transformKubernetesCluster } from './kubernetes-transform.js';

/**
 * Installs the Ceph CSI driver on a cluster, so its pods can claim persistent volumes.
 *
 * The driver is deployed asynchronously: the cluster comes back right away, so `features.isCsi` may
 * still be `false` or absent in the returned cluster, only turning on once the deployment has gone
 * through.
 *
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters/:XXX/csi/ceph
 * @group Kubernetes
 * @version 4
 */
export class AddKubernetesPersistentStorageCommand extends CcApiSimpleCommand<
  AddKubernetesPersistentStorageCommandInput,
  AddKubernetesPersistentStorageCommandOutput
> {
  toRequestParams(params: AddKubernetesPersistentStorageCommandInput) {
    return post(safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/csi/ceph`);
  }

  transformCommandOutput(response: unknown): AddKubernetesPersistentStorageCommandOutput {
    return transformKubernetesCluster(response);
  }
}
