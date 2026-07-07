import type { KubernetesNodeGroup } from './kubernetes.types.js';

export interface GetKubernetesNodeGroupCommandInput {
  ownerId: string;
  clusterId: string;
  nodeGroupId: string;
}

export type GetKubernetesNodeGroupCommandOutput = KubernetesNodeGroup;
