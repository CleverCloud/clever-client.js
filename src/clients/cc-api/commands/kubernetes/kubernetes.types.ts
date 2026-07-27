/**
 * Size of a control-plane component or of a worker node.
 */
export type KubernetesFlavor = '2XS' | 'XS' | 'S' | 'M' | 'L' | 'XL';

/**
 * Where a cluster stands: the `TO_*` statuses mean an operation has been asked for but not started,
 * the `-ING` ones that it is under way.
 */
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

/**
 * Where a node group stands in its lifecycle, from being requested to being torn down.
 */
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

/**
 * Where a single worker node stands. `DRAINING` means its workloads are being moved off it.
 */
export type KubernetesNodeStatus = 'DEPLOYING' | 'DEPLOYED' | 'READY' | 'DRAINING' | 'FAILED' | 'DELETED';

/**
 * How a kubeconfig reaches the API server: through the cluster's network group, through its load
 * balancer, or straight at the API server IP.
 */
export type KubernetesKubeConfigType = 'NETWORKGROUP' | 'LOADBALANCER' | 'APISERVER_IP';

/**
 * How the control plane is laid out: everything on one machine, the compute split off, or every
 * component on its own machines.
 *
 * Flavor availability is restricted per topology server-side (`TopologyConfig.validate` in OVD):
 * `ALL_IN_ONE` excludes `2XS`/`XS`, `DEDICATED_COMPUTE` excludes `2XS`.
 */
export type KubernetesTopologyConfig =
  | { topology: 'ALL_IN_ONE'; replicationFactor: number; flavor: 'S' | 'M' | 'L' | 'XL' }
  | { topology: 'DEDICATED_COMPUTE'; replicationFactor: number; flavor: 'XS' | 'S' | 'M' | 'L' | 'XL' }
  | { topology: 'DISTRIBUTED'; components: KubernetesDistributedComponents };

/**
 * How one control-plane component is sized and replicated.
 */
export interface KubernetesTopologyComponent {
  /** Size of each replica. */
  flavor: KubernetesFlavor;
  /** How many replicas of the component run. */
  replicationFactor: number;
}

/**
 * How each control-plane component is sized, on a fully distributed topology.
 */
export interface KubernetesDistributedComponents {
  /** The Kubernetes API server. */
  apiserver: KubernetesTopologyComponent;
  /** The controller manager running the built-in controllers. */
  controllerManager: KubernetesTopologyComponent;
  /** The scheduler placing pods onto nodes. */
  scheduler: KubernetesTopologyComponent;
  /** The Clever Cloud operator reconciling the node groups. */
  nodeGroupOperator: KubernetesTopologyComponent;
  /** The cloud controller manager wiring Kubernetes to the platform. */
  cloudControllerManager: KubernetesTopologyComponent;
}

/**
 * The optional capabilities of a cluster.
 */
export interface KubernetesClusterFeatures {
  /**
   * Whether the Ceph CSI driver is installed, so pods can claim persistent volumes.
   * @renamedFrom `csi`
   */
  isCsi?: boolean | null;
  /** Container registries the cluster is allowed to pull from. */
  registries?: string | null;
  /**
   * Whether node groups may scale themselves within their bounds.
   * @renamedFrom `autoscalingEnabled`
   */
  isAutoscalingEnabled?: boolean | null;
}

/**
 * The optional capabilities to turn on or off when creating or updating a cluster.
 */
export interface KubernetesClusterFeaturesPayload {
  /**
   * Whether to install the Ceph CSI driver, so pods can claim persistent volumes.
   * @sentAs `csi`
   */
  isCsi?: boolean | null;
  /** Container registries the cluster is allowed to pull from. */
  registries?: string | null;
  /**
   * Whether node groups may scale themselves within their bounds.
   * @sentAs `autoscalingEnabled`
   */
  isAutoscalingEnabled?: boolean | null;
}

/**
 * One worker node of a cluster.
 */
export interface KubernetesClusterNode {
  /** Identifier of the node. */
  id: string;
  /** Name the node is registered under in Kubernetes. */
  name: string;
  /** Where the node stands in its lifecycle. */
  status: KubernetesNodeStatus;
  /** Number of virtual CPUs the node offers. */
  vCpus: number;
  /** Memory the node offers, in bytes. */
  ramBytes: number;
}

/**
 * A node group as it appears on a cluster, with the nodes it currently runs.
 */
export interface KubernetesClusterNodeGroupSummary {
  /** Identifier of the node group. */
  id: string;
  /** Display name of the node group. */
  name: string;
  /** Where the node group stands in its lifecycle. */
  status: KubernetesNodeGroupStatus;
  /** Size every node of the group runs on. */
  flavor: KubernetesFlavor;
  /** How many nodes are running right now. */
  currentNodeCount: number;
  /** How many nodes the group is trying to reach. */
  targetNodeCount: number;
  /** The nodes themselves. */
  nodes: Array<KubernetesClusterNode>;
}

/**
 * A node group that is not attached to any cluster, listed without its nodes.
 */
export type KubernetesClusterStandaloneNodeGroupSummary = Omit<KubernetesClusterNodeGroupSummary, 'nodes'>;

/**
 * Size of a cluster load balancer. The suffix is how many instances back it: `duo`, `quattro` or
 * `octo`.
 */
export type KubernetesLoadBalancerFlavor =
  | 'XS-duo'
  | 'XS-quattro'
  | 'S-duo'
  | 'S-quattro'
  | 'M-quattro'
  | 'M-octo'
  | 'L-octo';

/**
 * A load balancer fronting a cluster.
 */
export interface KubernetesClusterLoadBalancer {
  /** Identifier of the load balancer. */
  id: string;
  /** Size of the load balancer. */
  flavor: KubernetesLoadBalancerFlavor;
  /** Public IP addresses the load balancer answers on. */
  ips: Array<string>;
  /** Domain name resolving to those addresses. */
  domainName: string;
}

/**
 * A managed Kubernetes cluster: its control plane, the node groups running the workloads, and the
 * load balancers fronting them.
 */
export interface KubernetesCluster {
  /** Identifier of the cluster. */
  id: string;
  /**
   * Identifier of the user or organisation owning the cluster.
   * @renamedFrom `tenantId`
   */
  ownerId: string;
  /** Display name of the cluster. */
  name: string;
  /** Free text description of the cluster. */
  description: string | null;
  /** Labels attached to the cluster. */
  tags: Array<string>;
  /** Where the cluster stands in its lifecycle. */
  status: KubernetesClusterStatus;
  /**
   * When the cluster was created.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
  /** Kubernetes version the control plane runs. */
  version: string;
  /** How the control plane is laid out and sized. */
  topologyConfig: KubernetesTopologyConfig;
  /** Identifier of the zone the cluster runs in. */
  locationId: string;
  /** Optional capabilities turned on for the cluster. */
  features: KubernetesClusterFeatures | null;
  /** The node groups attached to the cluster. */
  nodeGroups: Array<KubernetesClusterNodeGroupSummary>;
  /** Node groups created for this owner but not attached to any cluster. */
  standaloneNodeGroups: Array<KubernetesClusterStandaloneNodeGroupSummary>;
  /** The load balancers fronting the cluster. */
  loadBalancers: Array<KubernetesClusterLoadBalancer>;
  /** Persistent storage claimed by the cluster, in bytes. `null` when it has no CSI driver. */
  storageUsageBytes: number | null;
}

/**
 * One control-plane layout on offer, and what it can be sized with.
 */
export interface KubernetesProductTopology {
  /** The layout itself. */
  topology: 'ALL_IN_ONE' | 'DEDICATED_COMPUTE' | 'DISTRIBUTED';
  /** Sizes the control-plane components may run on with this layout. */
  availableFlavors: Array<KubernetesFlavor>;
  /** Bounds on how many replicas of each component may run. */
  replicationFactor: {
    /** Lowest allowed replication factor. */
    min: number;
    /** Highest allowed replication factor. */
    max: number;
  };
}

/**
 * What a new Kubernetes cluster can be built from: the layouts on offer and the versions available.
 */
export interface KubernetesProduct {
  /** The control-plane layouts on offer. */
  topologies: Array<KubernetesProductTopology>;
  /** The Kubernetes versions a cluster may run. */
  versions: {
    /**
     * Every version on offer.
     * @renamedFrom `available`
     */
    availableVersions: Array<string>;
    /** Version a new cluster gets when none is chosen. */
    default: string;
  };
}

/**
 * Where a cluster stands with respect to the Kubernetes versions on offer.
 */
export interface KubernetesClusterVersionCheck {
  /**
   * Every version the cluster can be moved to.
   * @renamedFrom `available`
   */
  availableVersions: Array<string>;
  /** Version the cluster currently runs. */
  installed: string;
  /** Newest version on offer. */
  latest: string;
  /** Whether a newer version than the installed one is available. */
  needUpdate: boolean;
}

/**
 * A Kubernetes taint, which keeps pods off a node unless they tolerate it.
 */
export interface KubernetesTaint {
  /** Key of the taint. */
  key: string;
  /** Value of the taint, when it carries one. */
  value?: string | null;
  /** What the taint does: refuse new pods, prefer not to place them, or evict the ones already there. */
  effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
}

/**
 * Description of a node group to create, either on its own or alongside a new cluster.
 */
export interface KubernetesNodeGroupCreationPayload {
  /** Display name of the node group. */
  name: string;
  /** Size every node of the group runs on. Immutable after creation. */
  flavor: KubernetesFlavor;
  /** How many nodes the group should run. */
  targetNodeCount: number;
  /** Free text description of the node group. */
  description?: string;
  /** Label attached to the node group. */
  tag?: string;
  /** Lowest node count autoscaling may go down to. */
  minNodeCount?: number;
  /** Highest node count autoscaling may go up to. */
  maxNodeCount?: number;
  /** Taints applied to every node of the group. Immutable after creation. */
  taints?: Array<KubernetesTaint>;
  /** Kubernetes labels applied to every node of the group. Immutable after creation. */
  labels?: Record<string, string>;
  /**
   * Whether the group scales itself between its bounds.
   * @sentAs `autoscalingEnabled`
   */
  isAutoscalingEnabled?: boolean;
}

/**
 * A pool of identically sized worker nodes attached to a cluster.
 */
export interface KubernetesNodeGroup {
  /** Identifier of the node group. */
  id: string;
  /** Identifier of the cluster the group belongs to. */
  clusterId: string;
  /** Display name of the node group. */
  name: string;
  /** Free text description of the node group. */
  description: string | null;
  /** Label attached to the node group. */
  tag: string | null;
  /** Size every node of the group runs on. */
  flavor: KubernetesFlavor;
  /** How many nodes are running right now. */
  currentNodeCount: number;
  /** How many nodes the group is trying to reach. */
  targetNodeCount: number;
  /** Lowest node count autoscaling may go down to. */
  minNodeCount: number;
  /** Highest node count autoscaling may go up to. */
  maxNodeCount: number;
  /** Taints applied to every node of the group. */
  taints: Array<KubernetesTaint>;
  /** Kubernetes labels applied to every node of the group. */
  labels: Record<string, string>;
  /**
   * When the node group was created.
   * @converted to an ISO date string
   */
  createdAt: string;
  /**
   * When the node group was last changed, absent while it has never been changed.
   * @converted to an ISO date string
   */
  updatedAt?: string;
  /** Where the node group stands in its lifecycle. */
  status: KubernetesNodeGroupStatus;
  /**
   * Whether the group scales itself between its bounds.
   * @renamedFrom `autoscalingEnabled`
   */
  isAutoscalingEnabled: boolean;
}

/**
 * A quantity a quota is expressed in, with a form ready to be displayed.
 */
export interface KubernetesQuotaDimension {
  /** Name of the quantity. */
  name: string;
  /** The amount itself. */
  number: number;
  /** Unit the amount is expressed in. */
  unit: string;
  /** The amount and its unit, already formatted. */
  readable: string;
}

/**
 * One limit applied to an owner, discriminated by what it caps: a call rate, a CPU or memory
 * ceiling, a connection count, an IP count, or a time series budget.
 *
 * Mirrors `core.models.quota.Quota` / `QuotaItem`, a cross-product model (not Kubernetes-specific)
 * that happens to be exposed here first — kept local to this domain for now since no shared quota
 * type exists elsewhere yet.
 */
export type KubernetesQuotaItem =
  | { type: 'APIRateLimit'; frequency: KubernetesQuotaDimension }
  | { type: 'MillivCPUMaxLimit'; maximum: number }
  | { type: 'CoreMaxLimit'; maximum: number }
  | { type: 'RamMaxUsage'; information: KubernetesQuotaDimension }
  | { type: 'MaxParrallelConnections'; maximum: number }
  | { type: 'MaxIp'; maximum: number }
  | { type: 'MaxMonthlyGtsCount'; maximum: number }
  | { type: 'MaxPointsPerDay'; maximum: number };

/**
 * The limits applied to an owner's Kubernetes usage.
 */
export interface KubernetesQuota {
  /** Identifier of the quota. */
  id: string;
  /**
   * Identifier of the user or organisation the quota applies to.
   * @renamedFrom `tenantId`
   */
  ownerId: string;
  /** Labels attached to the quota. */
  tags: Array<string>;
  /** The limits themselves. */
  quotas: Array<KubernetesQuotaItem>;
}

/**
 * One billable resource a cluster held over a period, as it goes into the invoice.
 */
export interface KubernetesClusterUsageItem {
  /** Identifier of the usage record. */
  id: string;
  /** Identifier of the cluster the resource belonged to. */
  clusterId: string;
  /** Identifier of the user or organisation being billed. */
  ownerId: string;
  /** What the resource is, for example a control-plane component or a worker node. */
  itemType: string;
  /** CPU the resource held, in millicores. */
  cpuMillicores: number;
  /** Memory the resource held, in bytes. */
  ramBytes: number;
  /**
   * When the resource started being billed.
   * @converted to an ISO date string
   */
  createdAt?: string;
  /**
   * When it stopped being billed, absent while it is still running.
   * @converted to an ISO date string
   */
  deactivatedAt?: string;
}

/**
 * The operation a cluster failure happened during.
 */
export type KubernetesDeploymentOperation =
  | 'CLUSTER_CREATE'
  | 'CLUSTER_REDEPLOY'
  | 'CLUSTER_UPGRADE'
  | 'CLUSTER_DELETE'
  | 'NODEGROUP_CREATE'
  | 'NODEGROUP_DELETE'
  | 'NODEGROUP_SCALE'
  | 'NODEGROUP_RESUME'
  | 'NODEGROUP_REDEPLOY';

/**
 * The step of an operation a cluster failure happened during.
 */
export type KubernetesDeploymentStepName =
  | 'NETWORK_GROUP'
  | 'LOADBALANCER_NETWORK'
  | 'MATERIA_LOGICALDB'
  | 'OTEL_CONFIG'
  | 'CONTROL_PLANE_BUNDLE'
  | 'STORAGE'
  | 'LOAD_BALANCER'
  | 'PLUGIN'
  | 'PLUGIN_RECONCILE'
  | 'REDEPLOY_BEFORE_YAML'
  | 'REDEPLOY_AFTER_YAML'
  | 'REDEPLOY_ORPHAN_SWEEP';

/**
 * Why an operation on a cluster or one of its node groups failed.
 */
export interface KubernetesClusterDeploymentFailure {
  /** The operation that failed. */
  operation: KubernetesDeploymentOperation;
  /** The step that failed, when the operation names its steps. */
  step?: KubernetesDeploymentStepName;
  /** Human readable reason the operation failed. */
  message: string;
  /**
   * When the failure happened.
   * @converted to an ISO date string
   */
  occurredAt: string;
}

/**
 * Where an infrastructure resource backing a cluster stands.
 */
export type KubernetesClusterItemStatus = 'ACTIVE' | 'DELETED' | 'FAILED_TO_DELETE';

/**
 * What kind of infrastructure resource a cluster item is.
 */
export type KubernetesClusterItemType =
  | 'NETWORK_GROUP'
  | 'LOAD_BALANCER'
  | 'STORAGE'
  | 'COMPONENT_BUNDLE'
  | 'NODE_GROUP'
  | 'LOADBALANCER_NETWORK'
  | 'OTEL_CONFIG'
  | 'MATERIA_LOGICALDB'
  | 'PLUGIN';

/**
 * How a cluster's network group came to be: created by the platform for the cluster, or an existing
 * one the user attached.
 */
export type KubernetesNetworkGroupOrigin = 'SYSTEM_CREATED' | 'USER_PROVIDED';

/**
 * A plugin the platform installs into a cluster.
 */
export type KubernetesPluginName =
  | 'CILIUM'
  | 'CORE_DNS'
  | 'CSR_APPROVER'
  | 'METRICS_SERVER'
  | 'KONNECTIVITY'
  | 'OTEL_COLLECTOR'
  | 'KUBE_STATE_METRICS';

/**
 * A control-plane component bundled onto a machine.
 */
export type KubernetesControlPlaneComponentType =
  | 'APISERVER'
  | 'CONTROLLER_MANAGER'
  | 'SCHEDULER'
  | 'NODE_GROUP_OPERATOR'
  | 'CLOUD_CONTROLLER_MANAGER'
  | 'NODE';

/**
 * How the control plane is laid out.
 */
export type KubernetesTopologyType = 'ALL_IN_ONE' | 'DEDICATED_COMPUTE' | 'DISTRIBUTED';

/**
 * The CephCSI setup backing a cluster's persistent storage, without the operator-internal monitors
 * and per-cluster Ceph credentials.
 */
export interface KubernetesCephCsiConfig {
  /** Identifier of the cluster the storage backs. */
  clusterId: string;
  /** Ceph RBD namespace the volumes live in. */
  cephNamespace: string;
  /** Ceph pool the volumes are provisioned from. */
  cephPool: string;
  /** Kubernetes namespace the CSI driver runs in. */
  kubernetesNamespace: string;
  /** Version of the CephCSI driver. */
  cephCSIVersion: string;
  /** How many CSI provisioner replicas run. */
  provisionerReplicas: number;
}

/**
 * How much compute a control-plane machine holds.
 */
export interface KubernetesResourcesSpec {
  /** CPU the machine holds, in millicores. */
  cpuMillicores: number;
  /** Memory the machine holds, in bytes. */
  memBytes: number;
  /** Disk the machine holds, in bytes. */
  diskBytes: number;
}

/**
 * A machine backing a control-plane bundle, without its internal IP and hypervisor identifier.
 */
export interface KubernetesVmData {
  /** Identifier of the machine. */
  id: string;
  /** Name of the machine. */
  name: string;
  /** How much compute the machine holds. */
  resourcesSpec: KubernetesResourcesSpec;
}

/**
 * One control-plane component running on a bundle machine, discriminated by `type`. Only the API
 * server carries a port; the single-node variant carries its node name; the rest carry nothing
 * beyond their kind.
 */
export type KubernetesBundledComponent =
  | { type: 'PublicApiServer'; componentType: 'APISERVER'; port: number | null }
  | { type: 'PublicControllerManager'; componentType: 'CONTROLLER_MANAGER' }
  | { type: 'PublicCloudControllerManager'; componentType: 'CLOUD_CONTROLLER_MANAGER' }
  | { type: 'PublicNodeGroupOperator'; componentType: 'NODE_GROUP_OPERATOR' }
  | { type: 'PublicScheduler'; componentType: 'SCHEDULER' }
  | { type: 'PublicSingleNode'; componentType: 'NODE'; name: string };

/**
 * The payload of a {@link KubernetesClusterItemEvent}, discriminated by `type`. Each variant is the
 * tenant-facing view of one kind of infrastructure resource, stripped of the credentials and
 * Clever-internal identifiers the backend keeps for itself.
 */
export type KubernetesClusterItemData =
  | {
      type: 'PublicNetworkGroupData';
      /**
       * Identifier of the user or organisation owning the network group.
       * @renamedFrom `tenantId`
       */
      ownerId: string;
      /** Identifier of the network group. */
      networkGroupId: string;
      /** How the network group came to be. */
      networkGroupOrigin: KubernetesNetworkGroupOrigin;
    }
  | {
      type: 'PublicLoadBalancerData';
      /**
       * Identifier of the user or organisation owning the load balancer.
       * @renamedFrom `tenantId`
       */
      ownerId: string;
      /** Identifier of the zone the load balancer runs in. */
      regionId: string;
      /** Identifier of the load-balancer cluster the deployment lives on. */
      lbClusterId: string;
      /** Domain name the load balancer answers on. */
      domainName: string;
      /** Port the load balancer listens on. */
      port: number;
    }
  | {
      type: 'PublicLoadBalancerNetworkData';
      /**
       * Identifier of the user or organisation owning the load-balancer network.
       * @renamedFrom `tenantId`
       */
      ownerId: string;
      /** Identifier of the network the load balancer is attached to. */
      networkId: string;
    }
  | {
      type: 'PublicNodeGroupData';
      /** Identifier of the node group. */
      id: string;
    }
  | {
      type: 'PublicMateriaLogicalDBData';
      /** Identifier of the Materia add-on backing the logical database. */
      addonId: string;
      /**
       * Identifier of the user or organisation owning the logical database.
       * @renamedFrom `orgId`
       */
      ownerId: string;
      /** Name of the Materia layer the logical database lives on. */
      layerName: string;
      /** Storage quota of the logical database, in bytes. */
      quotaBytes: number;
    }
  | {
      type: 'PublicPluginData';
      /** The plugin. */
      name: KubernetesPluginName;
      /** Version of the plugin. */
      version: string;
    }
  | {
      type: 'PublicStorageData';
      /** The CephCSI setup backing the storage. */
      containerStorageInterface: KubernetesCephCsiConfig;
    }
  | {
      type: 'PublicControlPlaneBundleData';
      /** The machine the bundle runs on. */
      vmData: KubernetesVmData;
      /** The control-plane components bundled on the machine. */
      components: Array<KubernetesBundledComponent>;
      /** How the control plane the bundle belongs to is laid out. */
      topologyType: KubernetesTopologyType;
    }
  | {
      type: 'PublicOtelConfigData';
      /**
       * Identifier of the user or organisation owning the OTel configuration.
       * @renamedFrom `tenantId`
       */
      ownerId: string;
      /** Endpoint logs are shipped to. */
      logsEndpoint: string;
      /** Endpoint traces are shipped to. */
      tracesEndpoint: string;
      /** Endpoint metrics are shipped to. */
      metricsEndpoint: string;
    };

/**
 * A cluster-level status transition.
 */
export interface KubernetesClusterStatusEvent {
  /** Discriminates this event as a cluster status transition. */
  event: 'CLUSTER_STATUS';
  /**
   * When the transition happened.
   * @converted to an ISO date string
   */
  date: string;
  /** Where the cluster now stands in its lifecycle. */
  status: KubernetesClusterStatus;
  /** Why the cluster reached a failure state, `null` unless it did. */
  failure: KubernetesClusterDeploymentFailure | null;
}

/**
 * A change to one infrastructure resource backing a cluster.
 */
export interface KubernetesClusterItemEvent {
  /** Discriminates this event as a cluster item change. */
  event: 'CLUSTER_ITEM';
  /**
   * When the change happened.
   * @converted to an ISO date string
   */
  date: string;
  /** Identifier of the cluster item. */
  id: string;
  /** What kind of infrastructure resource the item is. */
  itemType: KubernetesClusterItemType;
  /** Where the item now stands. */
  status: KubernetesClusterItemStatus;
  /** Detail of the item, absent on a deactivation event. */
  data?: KubernetesClusterItemData;
}

/**
 * A node-level lifecycle signal: a node became usable, failed, or was removed.
 */
export interface KubernetesNodeLifecycleEvent {
  /** Discriminates this event as a node lifecycle signal. */
  event: 'NODE_LIFECYCLE';
  /**
   * When the signal happened.
   * @converted to an ISO date string
   */
  date: string;
  /** Where the node now stands. */
  status: KubernetesNodeStatus;
  /** Identifier of the node. */
  nodeId: string;
  /** Name the node is registered under in Kubernetes. */
  nodeName: string;
  /** Identifier of the node group the node belongs to. */
  nodeGroupId: string;
  /** Size the node runs on. */
  flavor: KubernetesFlavor;
  /** Why the node reached a failure state, `null` unless it did. */
  failure: KubernetesClusterDeploymentFailure | null;
}

/**
 * One entry of a cluster's event log, discriminated by `event`: a cluster-level status transition,
 * a change to an infrastructure resource backing the cluster, or a node-level lifecycle signal.
 */
export type KubernetesClusterEvent =
  | KubernetesClusterStatusEvent
  | KubernetesClusterItemEvent
  | KubernetesNodeLifecycleEvent;
