import type { KubernetesNodeGroup } from './kubernetes.types.js';

/**
 * Despite being a PATCH, `name` and `targetNodeCount` are required by the API on every call — this is not
 * a true partial patch. Passing only e.g. `maxNodeCount` will get a 400: fetch the current node group first
 * (`GetKubernetesNodeGroupCommand`) and pass its `name`/`targetNodeCount` back if you only mean to change
 * something else. `flavor`, `taints` and `labels` are immutable after creation and cannot be patched at all.
 */
export interface UpdateKubernetesNodeGroupCommandInput {
  ownerId: string;
  clusterId: string;
  nodeGroupId: string;
  name: string;
  targetNodeCount: number;
  description?: string;
  tag?: string;
  minNodeCount?: number;
  maxNodeCount?: number;
  autoscalingEnabled?: boolean;
}

export type UpdateKubernetesNodeGroupCommandOutput = KubernetesNodeGroup;
