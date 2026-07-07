import type { KubernetesNodeGroup, KubernetesNodeGroupCreationPayload } from './kubernetes.types.js';

export interface CreateKubernetesNodeGroupCommandInput extends KubernetesNodeGroupCreationPayload {
  ownerId: string;
  clusterId: string;
}

export type CreateKubernetesNodeGroupCommandOutput = KubernetesNodeGroup;
