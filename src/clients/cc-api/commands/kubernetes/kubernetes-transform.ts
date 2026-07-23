import { normalizeDate } from '../../../../lib/utils.js';
import type {
  KubernetesCluster,
  KubernetesClusterFeatures,
  KubernetesClusterUsageItem,
  KubernetesClusterVersionCheck,
  KubernetesDeploymentEvent,
  KubernetesNodeGroup,
  KubernetesProduct,
  KubernetesQuota,
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
    description: payload.description,
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
    storageUsageBytes: payload.storageUsageBytes,
  };
}

function transformKubernetesClusterFeatures(payload: any): KubernetesClusterFeatures | null {
  if (payload == null) {
    return null;
  }
  return {
    isCsi: payload.csi,
    registries: payload.registries,
    isAutoscalingEnabled: payload.autoscalingEnabled,
  };
}

export function transformKubernetesNodeGroup(payload: any): KubernetesNodeGroup {
  return {
    id: payload.id,
    clusterId: payload.clusterId,
    name: payload.name,
    description: payload.description,
    tag: payload.tag,
    flavor: payload.flavor,
    currentNodeCount: payload.currentNodeCount,
    targetNodeCount: payload.targetNodeCount,
    minNodeCount: payload.minNodeCount,
    maxNodeCount: payload.maxNodeCount,
    taints: payload.taints,
    labels: payload.labels,
    createdAt: normalizeDate(payload.createdAt)!,
    updatedAt: normalizeDate(payload.updatedAt),
    status: payload.status,
    isAutoscalingEnabled: payload.autoscalingEnabled,
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

export function transformKubernetesDeploymentEvent(payload: any): KubernetesDeploymentEvent {
  return {
    operation: payload.operation,
    stepName: payload.stepName,
    status: payload.status,
    detail: payload.detail,
    createdAt: normalizeDate(payload.createdAt)!,
    nodeGroupId: payload.nodeGroupId,
  };
}
