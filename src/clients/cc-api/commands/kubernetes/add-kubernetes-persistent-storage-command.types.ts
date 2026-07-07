import type { KubernetesCluster } from './kubernetes.types.js';

export interface AddKubernetesPersistentStorageCommandInput {
  ownerId: string;
  clusterId: string;
}

export type AddKubernetesPersistentStorageCommandOutput = KubernetesCluster;
