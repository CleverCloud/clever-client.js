export type KubernetesFlavor = '2XS' | 'XS' | 'S' | 'M' | 'L' | 'XL';

export type KubernetesClusterStatus =
  | 'TO_DEPLOY'
  | 'DEPLOYING'
  | 'ACTIVE'
  | 'TO_REDEPLOY'
  | 'REDEPLOYING'
  | 'TO_UPGRADE'
  | 'UPDATING'
  | 'TO_DELETE'
  | 'DELETING'
  | 'DELETED'
  | 'FAILED';

export type KubernetesNodeGroupStatus =
  | 'PENDING'
  | 'CREATED'
  | 'DEPLOYING'
  | 'DEPLOYED'
  | 'TO_RESIZE'
  | 'RESIZING'
  | 'READY'
  | 'FAILED'
  | 'TO_TERMINATE'
  | 'TERMINATING'
  | 'DELETED';

export type KubernetesNodeStatus = 'DEPLOYING' | 'DEPLOYED' | 'READY' | 'DRAINING' | 'FAILED' | 'DELETED';

export type KubernetesKubeConfigType = 'NETWORKGROUP' | 'LOADBALANCER' | 'APISERVER_IP';

// Control-plane flavor availability is restricted per topology server-side (TopologyConfig.validate in OVD):
// ALL_IN_ONE excludes 2XS/XS, DEDICATED_COMPUTE excludes 2XS.
export type KubernetesTopologyConfig =
  | { topology: 'ALL_IN_ONE'; replicationFactor: number; flavor: 'S' | 'M' | 'L' | 'XL' }
  | { topology: 'DEDICATED_COMPUTE'; replicationFactor: number; flavor: 'XS' | 'S' | 'M' | 'L' | 'XL' }
  | { topology: 'DISTRIBUTED'; components: KubernetesDistributedComponents };

export interface KubernetesTopologyComponent {
  flavor: KubernetesFlavor;
  replicationFactor: number;
}

export interface KubernetesDistributedComponents {
  apiserver: KubernetesTopologyComponent;
  controllerManager: KubernetesTopologyComponent;
  scheduler: KubernetesTopologyComponent;
  nodeGroupOperator: KubernetesTopologyComponent;
  cloudControllerManager: KubernetesTopologyComponent;
}

export interface KubernetesClusterFeatures {
  csi?: boolean | null;
  registries?: string | null;
  autoscalingEnabled?: boolean | null;
}

export interface KubernetesClusterNode {
  id: string;
  name: string;
  status: KubernetesNodeStatus;
  vCpus: number;
  ramBytes: number;
}

export interface KubernetesClusterNodeGroupSummary {
  id: string;
  name: string;
  status: KubernetesNodeGroupStatus;
  flavor: KubernetesFlavor;
  currentNodeCount: number;
  targetNodeCount: number;
  nodes: Array<KubernetesClusterNode>;
}

export type KubernetesClusterStandaloneNodeGroupSummary = Omit<KubernetesClusterNodeGroupSummary, 'nodes'>;

export type KubernetesLoadBalancerFlavor =
  | 'XS-duo'
  | 'XS-quattro'
  | 'S-duo'
  | 'S-quattro'
  | 'M-quattro'
  | 'M-octo'
  | 'L-octo';

export interface KubernetesClusterLoadBalancer {
  id: string;
  flavor: KubernetesLoadBalancerFlavor;
  ips: Array<string>;
  domainName: string;
}

export interface KubernetesCluster {
  id: string;
  // renamed from tenantId
  ownerId: string;
  name: string;
  description: string | null;
  tags: Array<string>;
  status: KubernetesClusterStatus;
  // renamed from creationDate
  createdAt: string;
  version: string;
  topologyConfig: KubernetesTopologyConfig;
  locationId: string;
  features: KubernetesClusterFeatures | null;
  nodeGroups: Array<KubernetesClusterNodeGroupSummary>;
  standaloneNodeGroups: Array<KubernetesClusterStandaloneNodeGroupSummary>;
  loadBalancers: Array<KubernetesClusterLoadBalancer>;
  storageUsageBytes: number | null;
}

export interface KubernetesProductTopology {
  topology: 'ALL_IN_ONE' | 'DEDICATED_COMPUTE' | 'DISTRIBUTED';
  availableFlavors: Array<KubernetesFlavor>;
  replicationFactor: { min: number; max: number };
}

export interface KubernetesProduct {
  topologies: Array<KubernetesProductTopology>;
  versions: { available: Array<string>; default: string };
}

export interface KubernetesClusterVersionCheck {
  available: Array<string>;
  installed: string;
  latest: string;
  needUpdate: boolean;
}

export interface KubernetesTaint {
  key: string;
  value?: string | null;
  effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
}

export interface KubernetesNodeGroupCreationPayload {
  name: string;
  flavor: KubernetesFlavor;
  targetNodeCount: number;
  description?: string;
  tag?: string;
  minNodeCount?: number;
  maxNodeCount?: number;
  taints?: Array<KubernetesTaint>;
  labels?: Record<string, string>;
  autoscalingEnabled?: boolean;
}

export interface KubernetesNodeGroup {
  id: string;
  clusterId: string;
  name: string;
  description: string | null;
  tag: string | null;
  flavor: KubernetesFlavor;
  currentNodeCount: number;
  targetNodeCount: number;
  minNodeCount: number;
  maxNodeCount: number;
  taints: Array<KubernetesTaint>;
  labels: Record<string, string>;
  createdAt: string;
  updatedAt: string | null;
  status: KubernetesNodeGroupStatus;
  autoscalingEnabled: boolean;
}

export interface KubernetesQuotaDimension {
  name: string;
  number: number;
  unit: string;
  readable: string;
}

// core.models.quota.Quota / QuotaItem: a cross-product model (not Kubernetes-specific) that happens to be
// exposed here first — kept local to this domain for now since no shared Quota type exists elsewhere yet.
export type KubernetesQuotaItem =
  | { type: 'APIRateLimit'; frequency: KubernetesQuotaDimension }
  | { type: 'MillivCPUMaxLimit'; maximum: number }
  | { type: 'CoreMaxLimit'; maximum: number }
  | { type: 'RamMaxUsage'; information: KubernetesQuotaDimension }
  | { type: 'MaxParrallelConnections'; maximum: number }
  | { type: 'MaxIp'; maximum: number }
  | { type: 'MaxMonthlyGtsCount'; maximum: number }
  | { type: 'MaxPointsPerDay'; maximum: number };

export interface KubernetesQuota {
  id: string;
  // renamed from tenantId
  ownerId: string;
  tags: Array<string>;
  quotas: Array<KubernetesQuotaItem>;
}

export interface KubernetesClusterUsageItem {
  id: string;
  clusterId: string;
  ownerId: string;
  itemType: string;
  cpuMillicores: number;
  ramBytes: number;
  createdAt: string | null;
  deactivatedAt: string | null;
}

export type KubernetesDeploymentEventOperation =
  | 'CREATE'
  | 'REDEPLOY'
  | 'UPGRADE'
  | 'DELETE'
  | 'NODEGROUP_CREATE'
  | 'NODEGROUP_DELETE'
  | 'NODEGROUP_SCALE'
  | 'NODEGROUP_RESUME'
  | 'NODEGROUP_REDEPLOY';

export type KubernetesDeploymentEventStatus = 'STARTED' | 'COMPLETED' | 'FAILED';

export interface KubernetesDeploymentEvent {
  operation: KubernetesDeploymentEventOperation;
  stepName: string | null;
  status: KubernetesDeploymentEventStatus;
  detail: string | null;
  createdAt: string;
  nodeGroupId: string | null;
}
