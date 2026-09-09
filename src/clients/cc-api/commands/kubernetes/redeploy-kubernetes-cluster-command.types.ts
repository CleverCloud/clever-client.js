import type { KubernetesCluster } from './kubernetes.types.js';

/**
 * Identifies the cluster to redeploy, the YAML hooks to apply along the way, and whether to wait.
 */
export interface RedeployKubernetesClusterCommandInput {
  /** Identifier of the user or organisation owning the cluster. */
  ownerId: string;
  /** Identifier of the cluster. */
  clusterId: string;
  /**
   * Base64-encoded YAML documents applied right after redeploy validations pass and before any
   * control-plane VM is replaced.
   */
  beforeYamls?: Array<string>;
  /**
   * Base64-encoded YAML documents applied once the new control plane is healthy and the load
   * balancer points to it, before node groups are redeployed.
   */
  afterYamls?: Array<string>;
  /**
   * If true, wait until the cluster reaches the ACTIVE status before resolving.
   */
  shouldWaitForActive?: boolean;
}

/**
 * The cluster being redeployed. Only guaranteed to be `ACTIVE` when the command was asked to wait.
 */
export type RedeployKubernetesClusterCommandOutput = KubernetesCluster;
