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
  KubernetesTaint,
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
      throw new Error(`Unknown cluster event: ${payload.event}`);
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
 * The only wire keys the tenant-facing item data renames are the owner ones: `tenantId` on most
 * variants, `orgId` on the Materia one, both becoming `ownerId`. Every other field passes through
 * untouched, so a single generic remap covers all variants of the discriminated union — except the
 * one nullable field buried in the control-plane bundle, which is normalised first.
 */
function transformKubernetesClusterItemData(payload: any): KubernetesClusterItemData {
  const data = payload.type === 'PublicControlPlaneBundleData' ? withNormalizedComponents(payload) : payload;
  const ownerId = data.tenantId ?? data.orgId;
  if (ownerId === undefined) {
    return data;
  }
  const { tenantId, orgId, ...rest } = data;
  return { ...rest, ownerId };
}

/**
 * An API server bound to no public port is sent as `"port": null`, which the interface spells as an
 * absent key. Every other bundled component carries no nullable field.
 */
function withNormalizedComponents(payload: any): any {
  return {
    ...payload,
    components: payload.components?.map((component: any) =>
      component.type === 'PublicApiServer' ? { ...component, port: component.port ?? undefined } : component,
    ),
  };
}
