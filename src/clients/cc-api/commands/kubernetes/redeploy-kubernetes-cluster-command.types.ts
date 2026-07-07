import type { KubernetesCluster } from './kubernetes.types.js';

export interface RedeployKubernetesClusterCommandInput {
  ownerId: string;
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
  waitForActive?: boolean;
}

export type RedeployKubernetesClusterCommandOutput = KubernetesCluster;
