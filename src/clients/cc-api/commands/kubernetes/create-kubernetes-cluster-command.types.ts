import type {
  KubernetesCluster,
  KubernetesClusterFeatures,
  KubernetesNodeGroupCreationPayload,
  KubernetesTopologyConfig,
} from './kubernetes.types.js';

export interface CreateKubernetesClusterCommandInput {
  ownerId: string;
  name: string;
  version?: string;
  description?: string;
  tags?: Array<string>;
  networkGroupId?: string;
  // server defaults to DedicatedCompute(replicationFactor=1, flavor=XS) when omitted
  topologyConfig?: KubernetesTopologyConfig;
  locationId?: string;
  features?: KubernetesClusterFeatures;
  nodeGroups?: Array<KubernetesNodeGroupCreationPayload>;
  /**
   * If true, wait until the cluster reaches the ACTIVE status before resolving.
   */
  shouldWaitForActive?: boolean;
}

export type CreateKubernetesClusterCommandOutput = KubernetesCluster;
