import type { Composer } from '../../../../types/command.types.js';
import { tolerateNotFound } from '../../../../utils/error-utils.js';
import { Polling } from '../../../../utils/polling.js';
import type { CcApiType } from '../../types/cc-api.types.js';
import { GetKubernetesClusterCommand } from './get-kubernetes-cluster-command.js';
import type { KubernetesCluster } from './kubernetes.types.js';

// Cluster deletion/creation boot or tear down real VMs (see kubernetes-commands.spec.ts), so they need much
// longer timeouts than the lightweight resources (network groups, log drains) other wait helpers poll for.
const DELETION_POLLING_TIMEOUT_MS = 300_000;
// Provisioning can take several minutes; best-effort guess, unverified against the real API.
const ACTIVE_POLLING_TIMEOUT_MS = 480_000;
const POLLING_INTERVAL_MS = 2000;

/**
 * Wait for a kubernetes cluster to reach the DELETED status.
 */
export async function waitForKubernetesClusterDeletion(
  composer: Composer<CcApiType>,
  ownerId: string,
  clusterId: string,
): Promise<void> {
  const polling = new Polling(
    async () => {
      const cluster = await tolerateNotFound(composer.send(new GetKubernetesClusterCommand({ ownerId, clusterId })));
      return { stop: cluster == null || cluster.status === 'DELETED' };
    },
    POLLING_INTERVAL_MS,
    DELETION_POLLING_TIMEOUT_MS,
  );
  await polling.start();
}

/**
 * Wait for a kubernetes cluster to reach the ACTIVE status.
 */
export async function waitForKubernetesClusterActive(
  composer: Composer<CcApiType>,
  ownerId: string,
  clusterId: string,
): Promise<KubernetesCluster> {
  const polling = new Polling<KubernetesCluster>(
    async () => {
      const cluster = await tolerateNotFound(composer.send(new GetKubernetesClusterCommand({ ownerId, clusterId })));
      return cluster != null && (cluster.status === 'ACTIVE' || cluster.status === 'FAILED')
        ? { stop: true, value: cluster }
        : { stop: false };
    },
    POLLING_INTERVAL_MS,
    ACTIVE_POLLING_TIMEOUT_MS,
  );

  const cluster = await polling.start();

  if (cluster.status !== 'ACTIVE') {
    throw new Error(`Kubernetes cluster operation failed (status: ${cluster.status})`);
  }
  return cluster;
}
