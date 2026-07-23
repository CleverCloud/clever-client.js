import type { KubernetesNodeGroup } from './kubernetes.types.js';

/**
 * Despite being a PATCH, `name` and `targetNodeCount` are required by the API on every call — this is not
 * a true partial patch. Passing only e.g. `maxNodeCount` will get a 400: fetch the current node group first
 * (`GetKubernetesNodeGroupCommand`) and pass its `name`/`targetNodeCount` back if you only mean to change
 * something else. `flavor`, `taints` and `labels` are immutable after creation and cannot be patched at all.
 */
export interface UpdateKubernetesNodeGroupCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /** Identifier of the node group. */
  nodeGroupId: string;
  /** Display name of the node group. Required on every call, even when it does not change. */
  name: string;
  /** How many nodes the group should run. Required on every call, even when it does not change. */
  targetNodeCount: number;
  /** Free text description of the node group. */
  description?: string;
  /** Label attached to the node group. */
  tag?: string;
  /** Lowest node count autoscaling may go down to. */
  minNodeCount?: number;
  /** Highest node count autoscaling may go up to. */
  maxNodeCount?: number;
  /**
   * Whether the group scales itself between its bounds.
   * @sentAs `autoscalingEnabled`
   */
  isAutoscalingEnabled?: boolean;
}

/**
 * The node group as it stands after the update, before any resize has taken effect.
 */
export type UpdateKubernetesNodeGroupCommandOutput = KubernetesNodeGroup;
