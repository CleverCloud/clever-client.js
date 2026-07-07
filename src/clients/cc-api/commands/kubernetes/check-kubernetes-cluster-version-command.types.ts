import type { KubernetesClusterVersionCheck } from './kubernetes.types.js';

export interface CheckKubernetesClusterVersionCommandInput {
  ownerId: string;
  clusterId: string;
}

export type CheckKubernetesClusterVersionCommandOutput = KubernetesClusterVersionCheck;
