import { describe, expect, it } from 'vitest';
import { transformKubernetesClusterEvent } from '../../../../../../src/clients/cc-api/commands/kubernetes/kubernetes-transform.js';

/**
 * Mirrors one entry of `GET /v4/kubernetes/organisations/:id/clusters/:id/events`: a `CLUSTER_ITEM`
 * event wrapping one `PublicClusterItemData` variant under `data`.
 */
function buildClusterItemEvent(data: unknown) {
  return {
    event: 'CLUSTER_ITEM',
    date: '2026-01-15T10:30:00Z',
    id: 'cluster_item_01JABCDEF',
    itemType: 'COMPONENT_BUNDLE',
    status: 'ACTIVE',
    data,
  };
}

describe('kubernetes-transform', () => {
  describe('transformKubernetesClusterEvent', () => {
    it('should map the control plane bundle field by field', () => {
      const event = transformKubernetesClusterEvent(
        buildClusterItemEvent({
          type: 'PublicControlPlaneBundleData',
          vmData: {
            id: 'vm_01JABCDEF',
            name: 'apiserver-0',
            resourcesSpec: { cpuMillicores: 2000, memBytes: 4294967296, diskBytes: 21474836480 },
            hypervisorId: 'hv_leaked',
          },
          components: [
            { type: 'PublicApiServer', port: 6443 },
            { type: 'PublicScheduler' },
            { type: 'PublicSingleNode', name: 'node-0' },
          ],
          topologyType: 'ALL_IN_ONE',
        }),
      );

      expect(event).toEqual({
        event: 'CLUSTER_ITEM',
        date: '2026-01-15T10:30:00.000Z',
        id: 'cluster_item_01JABCDEF',
        itemType: 'COMPONENT_BUNDLE',
        status: 'ACTIVE',
        data: {
          type: 'PublicControlPlaneBundleData',
          vmData: {
            id: 'vm_01JABCDEF',
            name: 'apiserver-0',
            resourcesSpec: { cpuMillicores: 2000, memBytes: 4294967296, diskBytes: 21474836480 },
          },
          components: [
            { type: 'PublicApiServer', port: 6443 },
            { type: 'PublicScheduler' },
            { type: 'PublicSingleNode', name: 'node-0' },
          ],
          topologyType: 'ALL_IN_ONE',
        },
      });
    });

    it('should read an API server bound to no public port as an absent port', () => {
      const event = transformKubernetesClusterEvent(
        buildClusterItemEvent({
          type: 'PublicControlPlaneBundleData',
          vmData: {
            id: 'vm_01JABCDEF',
            name: 'apiserver-0',
            resourcesSpec: { cpuMillicores: 2000, memBytes: 4294967296, diskBytes: 21474836480 },
          },
          components: [{ type: 'PublicApiServer', port: null }],
          topologyType: 'ALL_IN_ONE',
        }),
      );

      const data = event.event === 'CLUSTER_ITEM' ? event.data : undefined;
      expect(data?.type).toBe('PublicControlPlaneBundleData');
      expect(data && 'components' in data ? data.components[0] : null).toEqual({ type: 'PublicApiServer' });
    });

    it('should keep an unknown component in place instead of dropping it', () => {
      const event = transformKubernetesClusterEvent(
        buildClusterItemEvent({
          type: 'PublicControlPlaneBundleData',
          vmData: {
            id: 'vm_01JABCDEF',
            name: 'apiserver-0',
            resourcesSpec: { cpuMillicores: 2000, memBytes: 4294967296, diskBytes: 21474836480 },
          },
          components: [
            { type: 'PublicScheduler' },
            { type: 'PublicEtcd', peerPort: 2380 },
            { type: 'PublicSingleNode', name: 'node-0' },
          ],
          topologyType: 'ALL_IN_ONE',
        }),
      );

      const data = event.event === 'CLUSTER_ITEM' ? event.data : undefined;
      expect(data && 'components' in data ? data.components : []).toEqual([
        { type: 'PublicScheduler' },
        { type: 'UNKNOWN_TO_CLIENT', payload: { type: 'PublicEtcd', peerPort: 2380 } },
        { type: 'PublicSingleNode', name: 'node-0' },
      ]);
    });

    it('should spell the CephCSI version the way the interface does', () => {
      const event = transformKubernetesClusterEvent(
        buildClusterItemEvent({
          type: 'PublicStorageData',
          containerStorageInterface: {
            clusterId: 'ceph-par',
            cephNamespace: 'k8s-01JABCDEF',
            cephPool: 'kubernetes',
            kubernetesNamespace: 'ceph-csi',
            cephCSIVersion: '3.11.0',
            provisionerReplicas: 2,
            cephXUser: 'leaked-credential',
          },
        }),
      );

      const data = event.event === 'CLUSTER_ITEM' ? event.data : undefined;
      expect(data).toEqual({
        type: 'PublicStorageData',
        containerStorageInterface: {
          clusterId: 'ceph-par',
          cephNamespace: 'k8s-01JABCDEF',
          cephPool: 'kubernetes',
          kubernetesNamespace: 'ceph-csi',
          cephCsiVersion: '3.11.0',
          provisionerReplicas: 2,
        },
      });
    });

    it('should publish the owner of a Materia logical database under one name', () => {
      const event = transformKubernetesClusterEvent(
        buildClusterItemEvent({
          type: 'PublicMateriaLogicalDBData',
          addonId: 'kubernetes_01JABCDEF',
          orgId: 'orga_01JABCDEF',
          layerName: 'layer-1',
          quotaBytes: 1073741824,
        }),
      );

      const data = event.event === 'CLUSTER_ITEM' ? event.data : undefined;
      expect(data).toEqual({
        type: 'PublicMateriaLogicalDBData',
        addonId: 'kubernetes_01JABCDEF',
        ownerId: 'orga_01JABCDEF',
        layerName: 'layer-1',
        quotaBytes: 1073741824,
      });
    });

    it('should publish an unknown item data kind as an unknown variant', () => {
      const payload = { type: 'PublicServiceMeshData', meshId: 'mesh_01JABCDEF' };
      const event = transformKubernetesClusterEvent(buildClusterItemEvent(payload));

      const data = event.event === 'CLUSTER_ITEM' ? event.data : undefined;
      expect(data).toEqual({ type: 'UNKNOWN_TO_CLIENT', payload });
    });
  });
});
