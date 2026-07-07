import type { KubernetesNodeGroup, KubernetesNodeGroupStatus } from './kubernetes.types.js';

export interface ListKubernetesNodeGroupCommandInput {
  ownerId: string;
  clusterId: string;
  status?: Array<KubernetesNodeGroupStatus>;
}

export type ListKubernetesNodeGroupCommandOutput = Array<KubernetesNodeGroup>;
