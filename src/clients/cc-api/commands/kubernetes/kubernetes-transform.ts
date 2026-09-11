import { normalizeDate, unknownToClient } from '../../../../lib/utils.js';
import type {
  KubernetesBundledComponent,
  KubernetesCephCsiConfig,
  KubernetesCluster,
  KubernetesClusterDeploymentFailure,
  KubernetesClusterEvent,
  KubernetesClusterFeatures,
  KubernetesClusterFeaturesPayload,
  KubernetesClusterItemData,
  KubernetesClusterUsageItem,
  KubernetesClusterVersionCheck,
  KubernetesNodeGroup,
  KubernetesProduct,
  KubernetesQuota,
  KubernetesTaint,
  KubernetesVmData,
} from './kubernetes.types.js';

export function transformKubernetesProduct(payload: any): KubernetesProduct {
  return {
    topologies: payload.topologies,
    versions: {
      availableVersions: payload.versions.available,
      default: payload.versions.default,
    },
  };
}

export function transformKubernetesClusterVersionCheck(payload: any): KubernetesClusterVersionCheck {
  return {
    availableVersions: payload.available,
    installed: payload.installed,
    latest: payload.latest,
    needUpdate: payload.needUpdate,
  };
}

export function transformKubernetesCluster(payload: any): KubernetesCluster {
  return {
    id: payload.id,
    ownerId: payload.tenantId,
    name: payload.name,
    description: payload.description ?? undefined,
    tags: payload.tags,
    status: payload.status,
    createdAt: normalizeDate(payload.creationDate)!,
    version: payload.version,
    topologyConfig: payload.topologyConfig,
    locationId: payload.locationId,
    features: transformKubernetesClusterFeatures(payload.features),
    nodeGroups: payload.nodeGroups,
    standaloneNodeGroups: payload.standaloneNodeGroups,
    loadBalancers: payload.loadBalancers,
    storageUsageBytes: payload.storageUsageBytes ?? undefined,
  };
}

/**
 * Maps the cluster feature payload back to the wire keys the backend expects
 * (`ClusterFeatures` / `ClusterFeaturesPatch`: `csi`, `registries`, `autoscalingEnabled`).
 */
export function serializeKubernetesClusterFeatures(features: KubernetesClusterFeaturesPayload | undefined) {
  if (features == null) {
    return undefined;
  }
  return {
    csi: features.isCsi,
    registries: features.registries,
    autoscalingEnabled: features.isAutoscalingEnabled,
  };
}

function transformKubernetesClusterFeatures(payload: any): KubernetesClusterFeatures | undefined {
  if (payload == null) {
    return undefined;
  }
  return {
    isCsi: payload.csi ?? undefined,
    registries: payload.registries ?? undefined,
    isAutoscalingEnabled: payload.autoscalingEnabled ?? undefined,
  };
}

export function transformKubernetesNodeGroup(payload: any): KubernetesNodeGroup {
  return {
    id: payload.id,
    clusterId: payload.clusterId,
    name: payload.name,
    description: payload.description ?? undefined,
    tag: payload.tag ?? undefined,
    flavor: payload.flavor,
    currentNodeCount: payload.currentNodeCount,
    targetNodeCount: payload.targetNodeCount,
    minNodeCount: payload.minNodeCount,
    maxNodeCount: payload.maxNodeCount,
    taints: payload.taints?.map(transformKubernetesTaint),
    labels: payload.labels,
    createdAt: normalizeDate(payload.createdAt)!,
    updatedAt: normalizeDate(payload.updatedAt),
    status: payload.status,
    isAutoscalingEnabled: payload.autoscalingEnabled,
  };
}

/** A taint with no value is sent as `"value": null`, which the interface spells as an absent key. */
function transformKubernetesTaint(payload: any): KubernetesTaint {
  return {
    key: payload.key,
    value: payload.value ?? undefined,
    effect: payload.effect,
  };
}

export function transformKubernetesQuota(payload: any): KubernetesQuota {
  return {
    id: payload.id,
    ownerId: payload.tenantId,
    tags: payload.tags,
    quotas: payload.quotas,
  };
}

export function transformKubernetesClusterUsageItem(payload: any): KubernetesClusterUsageItem {
  return {
    id: payload.id,
    clusterId: payload.clusterId,
    ownerId: payload.ownerId,
    itemType: payload.itemType,
    cpuMillicores: payload.cpuMillicores,
    ramBytes: payload.ramBytes,
    createdAt: normalizeDate(payload.createdAt),
    deactivatedAt: normalizeDate(payload.deactivatedAt),
  };
}

export function transformKubernetesClusterEvent(payload: any): KubernetesClusterEvent {
  switch (payload.event) {
    case 'CLUSTER_STATUS':
      return {
        event: 'CLUSTER_STATUS',
        date: normalizeDate(payload.date)!,
        status: payload.status,
        failure: transformKubernetesClusterDeploymentFailure(payload.failure),
      };
    case 'CLUSTER_ITEM':
      return {
        event: 'CLUSTER_ITEM',
        date: normalizeDate(payload.date)!,
        id: payload.id,
        itemType: payload.itemType,
        status: payload.status,
        ...(payload.data == null ? {} : { data: transformKubernetesClusterItemData(payload.data) }),
      };
    case 'NODE_LIFECYCLE':
      return {
        event: 'NODE_LIFECYCLE',
        date: normalizeDate(payload.date)!,
        status: payload.status,
        nodeId: payload.nodeId,
        nodeName: payload.nodeName,
        nodeGroupId: payload.nodeGroupId,
        flavor: payload.flavor,
        failure: transformKubernetesClusterDeploymentFailure(payload.failure),
      };
    default:
      return unknownToClient('event', payload);
  }
}

function transformKubernetesClusterDeploymentFailure(payload: any): KubernetesClusterDeploymentFailure | undefined {
  if (payload == null) {
    return undefined;
  }
  return {
    operation: payload.operation,
    step: payload.step,
    message: payload.message,
    occurredAt: normalizeDate(payload.occurredAt)!,
  };
}

/**
 * The tenant-facing view of one infrastructure resource backing a cluster. The only wire keys
 * renamed are the owner ones: `tenantId` on most variants, `orgId` on the Materia one.
 */
function transformKubernetesClusterItemData(payload: any): KubernetesClusterItemData {
  switch (payload.type) {
    case 'PublicNetworkGroupData':
      return {
        type: 'PublicNetworkGroupData',
        ownerId: payload.tenantId,
        networkGroupId: payload.networkGroupId,
        networkGroupOrigin: payload.networkGroupOrigin,
      };
    case 'PublicLoadBalancerData':
      return {
        type: 'PublicLoadBalancerData',
        ownerId: payload.tenantId,
        regionId: payload.regionId,
        lbClusterId: payload.lbClusterId,
        domainName: payload.domainName,
        port: payload.port,
      };
    case 'PublicLoadBalancerNetworkData':
      return {
        type: 'PublicLoadBalancerNetworkData',
        ownerId: payload.tenantId,
        networkId: payload.networkId,
      };
    case 'PublicNodeGroupData':
      return {
        type: 'PublicNodeGroupData',
        id: payload.id,
      };
    case 'PublicMateriaLogicalDBData':
      return {
        type: 'PublicMateriaLogicalDBData',
        addonId: payload.addonId,
        ownerId: payload.orgId,
        layerName: payload.layerName,
        quotaBytes: payload.quotaBytes,
      };
    case 'PublicPluginData':
      return {
        type: 'PublicPluginData',
        name: payload.name,
        version: payload.version,
      };
    case 'PublicStorageData':
      return {
        type: 'PublicStorageData',
        containerStorageInterface: transformKubernetesCephCsiConfig(payload.containerStorageInterface),
      };
    case 'PublicControlPlaneBundleData':
      return {
        type: 'PublicControlPlaneBundleData',
        vmData: transformKubernetesVmData(payload.vmData),
        components: payload.components.map(transformKubernetesBundledComponent),
        topologyType: payload.topologyType,
      };
    case 'PublicOtelConfigData':
      return {
        type: 'PublicOtelConfigData',
        ownerId: payload.tenantId,
        logsEndpoint: payload.logsEndpoint,
        tracesEndpoint: payload.tracesEndpoint,
        metricsEndpoint: payload.metricsEndpoint,
      };
    default:
      return unknownToClient('type', payload);
  }
}

/** The CephCSI version is the one place the payload spells an acronym in the all-uppercase form. */
function transformKubernetesCephCsiConfig(payload: any): KubernetesCephCsiConfig {
  return {
    clusterId: payload.clusterId,
    cephNamespace: payload.cephNamespace,
    cephPool: payload.cephPool,
    kubernetesNamespace: payload.kubernetesNamespace,
    cephCsiVersion: payload.cephCSIVersion,
    provisionerReplicas: payload.provisionerReplicas,
  };
}

function transformKubernetesVmData(payload: any): KubernetesVmData {
  return {
    id: payload.id,
    name: payload.name,
    resourcesSpec: {
      cpuMillicores: payload.resourcesSpec.cpuMillicores,
      memBytes: payload.resourcesSpec.memBytes,
      diskBytes: payload.resourcesSpec.diskBytes,
    },
  };
}

/**
 * The API server is the only component carrying a field of its own besides the single node, and an
 * API server bound to no public port is sent as `"port": null`, which the interface spells as an
 * absent key.
 */
function transformKubernetesBundledComponent(payload: any): KubernetesBundledComponent {
  switch (payload.type) {
    case 'PublicApiServer':
      return {
        type: 'PublicApiServer',
        port: payload.port ?? undefined,
      };
    case 'PublicControllerManager':
      return { type: 'PublicControllerManager' };
    case 'PublicCloudControllerManager':
      return { type: 'PublicCloudControllerManager' };
    case 'PublicNodeGroupOperator':
      return { type: 'PublicNodeGroupOperator' };
    case 'PublicScheduler':
      return { type: 'PublicScheduler' };
    case 'PublicSingleNode':
      return {
        type: 'PublicSingleNode',
        name: payload.name,
      };
    default:
      return unknownToClient('type', payload);
  }
}
