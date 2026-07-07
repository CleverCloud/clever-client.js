import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { AddKubernetesPersistentStorageCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/add-kubernetes-persistent-storage-command.js';
import { CheckKubernetesClusterVersionCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/check-kubernetes-cluster-version-command.js';
import { CreateKubernetesClusterCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/create-kubernetes-cluster-command.js';
import { CreateKubernetesNodeGroupCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/create-kubernetes-node-group-command.js';
import { DeleteKubernetesClusterCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/delete-kubernetes-cluster-command.js';
import { DeleteKubernetesNodeGroupCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/delete-kubernetes-node-group-command.js';
import { GetKubernetesClusterCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/get-kubernetes-cluster-command.js';
import { GetKubernetesKubeconfigCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/get-kubernetes-kubeconfig-command.js';
import { GetKubernetesKubeconfigPresignedUrlCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/get-kubernetes-kubeconfig-presigned-url-command.js';
import { GetKubernetesNodeGroupCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/get-kubernetes-node-group-command.js';
import { GetKubernetesProductCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/get-kubernetes-product-command.js';
import { GetKubernetesQuotaCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/get-kubernetes-quota-command.js';
import type { KubernetesCluster } from '../../../../../src/clients/cc-api/commands/kubernetes/kubernetes.types.js';
import { ListKubernetesClusterCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/list-kubernetes-cluster-command.js';
import { ListKubernetesDeploymentEventCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/list-kubernetes-deployment-event-command.js';
import { ListKubernetesNodeGroupCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/list-kubernetes-node-group-command.js';
import { ListKubernetesUsageCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/list-kubernetes-usage-command.js';
import { RedeployKubernetesClusterCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/redeploy-kubernetes-cluster-command.js';
import { ResumeKubernetesClusterCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/resume-kubernetes-cluster-command.js';
import { UpdateKubernetesClusterCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/update-kubernetes-cluster-command.js';
import { UpdateKubernetesClusterVersionCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/update-kubernetes-cluster-version-command.js';
import { UpdateKubernetesNodeGroupCommand } from '../../../../../src/clients/cc-api/commands/kubernetes/update-kubernetes-node-group-command.js';
import { e2eSupport } from '../e2e-support.js';

// Kubernetes clusters are not addon-plan based (no `providerId`/`planId`): creation goes straight through
// the dedicated /v4/kubernetes/... endpoint (see cc-configure-kubernetes.smart.js / clever-tools' k8s.js),
// so we can't reuse `support.createTestAddon()` like the otoroshi/network-group suites do. Clusters created
// here are tracked and cleaned up locally instead. Stage B (node-group/quota/usage/events commands) can
// append to this file and reuse `createTestCluster` below, passing `{ waitForActive: true }` when the test
// needs a live cluster.
describe('kubernetes commands', function () {
  const support = e2eSupport();

  let createdClusterIds: Array<string> = [];

  async function createTestCluster(
    name = 'test-cluster',
    options: { waitForActive?: boolean } = {},
  ): Promise<KubernetesCluster> {
    const cluster = await support.client.send(
      new CreateKubernetesClusterCommand({
        ownerId: support.organisationId,
        name,
        // XS is only valid for DEDICATED_COMPUTE server-side (TopologyConfig.validate in OVD); ALL_IN_ONE's
        // smallest allowed flavor is S.
        topologyConfig: { topology: 'ALL_IN_ONE', flavor: 'S', replicationFactor: 1 },
        waitForActive: options.waitForActive,
      }),
    );
    createdClusterIds.push(cluster.id);
    return cluster;
  }

  beforeAll(async () => {
    await support.prepare();
  });

  // Waits for real deletion (up to the 300_000ms polling timeout in kubernetes-utils.ts), which exceeds
  // the project's default 30_000ms hookTimeout, hence the explicit override below.
  afterEach(async () => {
    await Promise.allSettled(
      createdClusterIds.map((clusterId) =>
        support.client.send(
          new DeleteKubernetesClusterCommand({ ownerId: support.organisationId, clusterId, wait: true }),
        ),
      ),
    );
    createdClusterIds = [];
  }, 330_000);

  afterAll(async () => {
    await support.cleanup();
  });

  it.skip('should get kubernetes product', async () => {
    const response = await support.client.send(new GetKubernetesProductCommand());

    expect(response.topologies).toBeInstanceOf(Array);
    expect(response.topologies.length).toBeGreaterThan(0);
    expect(response.topologies[0].topology).toBeTypeOf('string');
    expect(response.topologies[0].availableFlavors).toBeInstanceOf(Array);
    expect(response.topologies[0].replicationFactor.min).toBeTypeOf('number');
    expect(response.topologies[0].replicationFactor.max).toBeTypeOf('number');
    expect(response.versions.available).toBeInstanceOf(Array);
    expect(response.versions.default).toBeTypeOf('string');
  });

  it('should create a kubernetes cluster', async () => {
    const cluster = await createTestCluster('test-cluster-create');

    expect(cluster.id).toMatch(/^kubernetes_/);
    expect(cluster.ownerId).toBe(support.organisationId);
    expect(cluster.name).toBe('test-cluster-create');
    expect(cluster.status).toBeTypeOf('string');
    expect(cluster.createdAt).toBeTypeOf('string');
    expect(cluster.topologyConfig.topology).toBe('ALL_IN_ONE');
  });

  it.skip('should get a kubernetes cluster', async () => {
    const created = await createTestCluster('test-cluster-get');

    const cluster = await support.client.send(
      new GetKubernetesClusterCommand({ ownerId: support.organisationId, clusterId: created.id }),
    );

    expect(cluster.id).toBe(created.id);
    expect(cluster.name).toBe('test-cluster-get');
  });

  it.skip('should return null when getting a non-existent kubernetes cluster', async () => {
    const cluster = await support.client.send(
      new GetKubernetesClusterCommand({
        ownerId: support.organisationId,
        // valid `kubernetes_<ulid>` shape (KubernetesId.zero) that is very unlikely to ever exist
        clusterId: 'kubernetes_00000000000000000000000000',
      }),
    );

    expect(cluster).toBeNull();
  });

  it.skip('should list kubernetes clusters', async () => {
    const created = await createTestCluster('test-cluster-list');

    const clusters = await support.client.send(new ListKubernetesClusterCommand({ ownerId: support.organisationId }));

    expect(clusters).toBeInstanceOf(Array);
    expect(clusters.some((cluster) => cluster.id === created.id)).toBe(true);
  });

  it.skip('should update a kubernetes cluster', async () => {
    const created = await createTestCluster('test-cluster-update');

    const updated = await support.client.send(
      new UpdateKubernetesClusterCommand({
        ownerId: support.organisationId,
        clusterId: created.id,
        description: 'updated description',
      }),
    );

    expect(updated.id).toBe(created.id);
    expect(updated.description).toBe('updated description');
  });

  it.skip('should delete a kubernetes cluster', async () => {
    const created = await createTestCluster('test-cluster-delete');

    const response = await support.client.send(
      new DeleteKubernetesClusterCommand({ ownerId: support.organisationId, clusterId: created.id }),
    );

    expect(response).toBeUndefined();
    // already deleted, no need for afterEach to clean it up too
    createdClusterIds = createdClusterIds.filter((id) => id !== created.id);
  });

  // Deletion tears down real VMs, so this can take a while — hence the much larger timeout.
  it.skip('should delete a kubernetes cluster and wait for it to reach DELETED', async () => {
    const created = await createTestCluster('test-cluster-delete-wait');

    const response = await support.client.send(
      new DeleteKubernetesClusterCommand({ ownerId: support.organisationId, clusterId: created.id, wait: true }),
    );

    expect(response).toBeUndefined();

    const cluster = await support.client.send(
      new GetKubernetesClusterCommand({ ownerId: support.organisationId, clusterId: created.id }),
    );
    expect(cluster == null || cluster.status === 'DELETED').toBe(true);

    // already deleted, no need for afterEach to clean it up too
    createdClusterIds = createdClusterIds.filter((id) => id !== created.id);
  }, 600_000);

  // These endpoints operate on a live cluster, so this test waits for real provisioning to reach ACTIVE
  // before exercising them — hence the much larger timeout than the other tests in this file.
  it.skip('should check/update the version, redeploy, get the kubeconfig and add persistent storage once the cluster is active', async () => {
    const active = await createTestCluster('test-cluster-lifecycle', { waitForActive: true });

    const versionCheck = await support.client.send(
      new CheckKubernetesClusterVersionCommand({ ownerId: support.organisationId, clusterId: active.id }),
    );
    expect(versionCheck.installed).toBeTypeOf('string');
    expect(versionCheck.latest).toBeTypeOf('string');
    expect(versionCheck.available).toContain(versionCheck.latest);
    expect(versionCheck.needUpdate).toBeTypeOf('boolean');

    const updatedVersion = await support.client.send(
      new UpdateKubernetesClusterVersionCommand({
        ownerId: support.organisationId,
        clusterId: active.id,
        targetVersion: versionCheck.installed,
        waitForActive: true,
      }),
    );
    expect(updatedVersion.id).toBe(active.id);
    expect(updatedVersion.status).toBe('ACTIVE');

    const redeployed = await support.client.send(
      new RedeployKubernetesClusterCommand({
        ownerId: support.organisationId,
        clusterId: active.id,
        waitForActive: true,
      }),
    );
    expect(redeployed.id).toBe(active.id);
    expect(redeployed.status).toBe('ACTIVE');

    const kubeconfig = await support.client.send(
      new GetKubernetesKubeconfigCommand({ ownerId: support.organisationId, clusterId: active.id }),
    );
    expect(kubeconfig).toBeTypeOf('string');
    expect(kubeconfig.length).toBeGreaterThan(0);

    const presignedUrl = await support.client.send(
      new GetKubernetesKubeconfigPresignedUrlCommand({ ownerId: support.organisationId, clusterId: active.id }),
    );
    expect(presignedUrl.url).toBeTypeOf('string');

    const withStorage = await support.client.send(
      new AddKubernetesPersistentStorageCommand({ ownerId: support.organisationId, clusterId: active.id }),
    );
    expect(withStorage.id).toBe(active.id);
    expect(withStorage.features?.csi).toBe(true);
  }, 600_000);

  // resume is only allowed from FAILED (see status-lifecycle.md in OVD); a freshly created cluster is
  // TO_DEPLOY/DEPLOYING, so this is a fast, deterministic way to exercise the rejection path without
  // needing to force a real deployment failure.
  it('should reject resuming a kubernetes cluster that is not FAILED', async () => {
    const created = await createTestCluster('test-cluster-resume-rejected');

    await expect(
      support.client.send(
        new ResumeKubernetesClusterCommand({ ownerId: support.organisationId, clusterId: created.id }),
      ),
    ).rejects.toThrow();
  });

  it.skip('should get the kubernetes quota for an organisation', async () => {
    const quota = await support.client.send(new GetKubernetesQuotaCommand({ ownerId: support.organisationId }));

    expect(quota.ownerId).toBe(support.organisationId);
    expect(quota.tags).toBeInstanceOf(Array);
    expect(quota.quotas).toBeInstanceOf(Array);
  });

  it.skip('should list the kubernetes usage for an organisation', async () => {
    const usage = await support.client.send(new ListKubernetesUsageCommand({ ownerId: support.organisationId }));

    expect(usage).toBeInstanceOf(Array);
  });

  // Node groups and deployment events operate on a live cluster, so this test waits for real provisioning to
  // reach ACTIVE before exercising them, same as the version/kubeconfig/csi test above.
  it('should list, create, get, update and delete node groups, and list deployment events, on an active cluster', async () => {
    const active = await createTestCluster('test-cluster-node-groups', { waitForActive: true });

    const nodeGroupsBefore = await support.client.send(
      new ListKubernetesNodeGroupCommand({ ownerId: support.organisationId, clusterId: active.id }),
    );
    expect(nodeGroupsBefore).toBeInstanceOf(Array);

    const nodeGroup = await support.client.send(
      new CreateKubernetesNodeGroupCommand({
        ownerId: support.organisationId,
        clusterId: active.id,
        name: 'test-node-group',
        flavor: 'XS',
        targetNodeCount: 1,
      }),
    );
    expect(nodeGroup.id).toMatch(/^node_group_/);
    expect(nodeGroup.clusterId).toBe(active.id);
    expect(nodeGroup.name).toBe('test-node-group');

    const fetched = await support.client.send(
      new GetKubernetesNodeGroupCommand({
        ownerId: support.organisationId,
        clusterId: active.id,
        nodeGroupId: nodeGroup.id,
      }),
    );
    expect(fetched.id).toBe(nodeGroup.id);

    // name/targetNodeCount must be re-sent as-is: this PATCH endpoint is not a true partial patch (see
    // update-kubernetes-node-group-command.types.ts)
    const updated = await support.client.send(
      new UpdateKubernetesNodeGroupCommand({
        ownerId: support.organisationId,
        clusterId: active.id,
        nodeGroupId: nodeGroup.id,
        name: nodeGroup.name,
        targetNodeCount: nodeGroup.targetNodeCount,
        maxNodeCount: 3,
      }),
    );
    expect(updated.id).toBe(nodeGroup.id);
    expect(updated.maxNodeCount).toBe(3);

    const events = await support.client.send(
      new ListKubernetesDeploymentEventCommand({ ownerId: support.organisationId, clusterId: active.id, limit: 10 }),
    );
    expect(events).toBeInstanceOf(Array);

    const deleted = await support.client.send(
      new DeleteKubernetesNodeGroupCommand({
        ownerId: support.organisationId,
        clusterId: active.id,
        nodeGroupId: nodeGroup.id,
      }),
    );
    expect(deleted).toBeUndefined();
  }, 600_000);
});
