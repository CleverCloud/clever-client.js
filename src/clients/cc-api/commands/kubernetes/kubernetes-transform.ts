import { normalizeDate } from '../../../../lib/utils.js';
import type {
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
      throw new Error(`Unknown cluster event: ${payload.event}`);
  }
}

function transformKubernetesClusterDeploymentFailure(payload: any): KubernetesClusterDeploymentFailure | null {
  if (payload == null) {
    return null;
  }
  return {
    operation: payload.operation,
    step: payload.step,
    message: payload.message,
    occurredAt: normalizeDate(payload.occurredAt)!,
  };
}

/**
 * The only wire keys the tenant-facing item data renames are the owner ones: `tenantId` on most
 * variants, `orgId` on the Materia one, both becoming `ownerId`. Every other field (including nested
 * control-plane bundle data) passes through untouched, so a single generic remap covers all variants
 * of the discriminated union.
 */
function transformKubernetesClusterItemData(payload: any): KubernetesClusterItemData {
  const ownerId = payload.tenantId ?? payload.orgId;
  if (ownerId === undefined) {
    return payload;
  }
  const { tenantId, orgId, ...rest } = payload;
  return { ...rest, ownerId };
}
