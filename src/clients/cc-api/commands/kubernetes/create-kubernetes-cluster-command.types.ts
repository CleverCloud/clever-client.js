import type {
  KubernetesCluster,
  KubernetesClusterFeatures,
  KubernetesNodeGroupCreationPayload,
  KubernetesTopologyConfig,
} from './kubernetes.types.js';

/**
 * Description of the Kubernetes cluster to create.
 */
export interface CreateKubernetesClusterCommandInput {
  /** Identifier of the user or organisation that will own the cluster. */
  ownerId: string;
  /** Display name of the cluster. */
  name: string;
  /** Kubernetes version to run. Falls back to the catalogue default. */
  version?: string;
  /** Free text description of the cluster. */
  description?: string;
  /** Labels to attach to the cluster. */
  tags?: Array<string>;
  /** Identifier of the network group to put the cluster in. */
  networkGroupId?: string;
  /**
   * How the control plane should be laid out and sized.
   * The server defaults to `DEDICATED_COMPUTE` with a replication factor of 1 on `XS` when omitted.
   */
  topologyConfig?: KubernetesTopologyConfig;
  /** Identifier of the zone to run the cluster in. */
  locationId?: string;
  /** Optional capabilities to turn on. */
  features?: KubernetesClusterFeatures;
  /** Node groups to create alongside the cluster. */
  nodeGroups?: Array<KubernetesNodeGroupCreationPayload>;
  /**
   * If true, wait until the cluster reaches the ACTIVE status before resolving.
   */
  shouldWaitForActive?: boolean;
}

/**
 * The cluster that was created. Only guaranteed to be `ACTIVE` when the command was asked to wait.
 */
export type CreateKubernetesClusterCommandOutput = KubernetesCluster;
