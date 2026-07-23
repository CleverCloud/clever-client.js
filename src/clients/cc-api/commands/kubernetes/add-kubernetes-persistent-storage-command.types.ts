import type { KubernetesCluster } from './kubernetes.types.js';

/**
 * Identifies the cluster to install persistent storage on.
 */
export interface AddKubernetesPersistentStorageCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
}

/**
 * The cluster the driver was installed on, as it stands right after the request.
 */
export type AddKubernetesPersistentStorageCommandOutput = KubernetesCluster;
