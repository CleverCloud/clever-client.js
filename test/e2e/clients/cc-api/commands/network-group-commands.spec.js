import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { CreateNetworkGroupExternalPeerCommand } from '../../../../../src/clients/cc-api/commands/network-group/create-network-group-external-peer-command.js';
import { CreateNetworkGroupMemberCommand } from '../../../../../src/clients/cc-api/commands/network-group/create-network-group-member-command.js';
import { DeleteNetworkGroupCommand } from '../../../../../src/clients/cc-api/commands/network-group/delete-network-group-command.js';
import { DeleteNetworkGroupExternalPeerCommand } from '../../../../../src/clients/cc-api/commands/network-group/delete-network-group-external-peer-command.js';
import { DeleteNetworkGroupMemberCommand } from '../../../../../src/clients/cc-api/commands/network-group/delete-network-group-member-command.js';
import { GetNetworkGroupCommand } from '../../../../../src/clients/cc-api/commands/network-group/get-network-group-command.js';
import { GetNetworkGroupWireguardConfigurationCommand } from '../../../../../src/clients/cc-api/commands/network-group/get-network-group-wireguard-configuration-command.js';
import { GetNetworkGroupWireguardConfigurationUrlCommand } from '../../../../../src/clients/cc-api/commands/network-group/get-network-group-wireguard-configuration-url-command.js';
import { ListNetworkGroupCommand } from '../../../../../src/clients/cc-api/commands/network-group/list-network-group-command.js';
import { generateExternalMemberId } from '../../../../../src/clients/cc-api/commands/network-group/network-group-utils.js';
import { SearchNetworkGroupCommand } from '../../../../../src/clients/cc-api/commands/network-group/search-network-group-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('network-group commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await Promise.all([support.deleteApplications(), support.deleteAddons(), support.deleteNetworkGroups()]);
  });

  it('should get network group', async () => {
    const application = await support.createTestApplication();
    const createdNetworkGroup = await support.createNetworkGroup(application.id);

    const response = await support.client.send(
      new GetNetworkGroupCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
      }),
    );

    expect(response).toEqualInAnyOrder(createdNetworkGroup);
  });

  it('should get network group null', async () => {
    const response = await support.client.send(
      new GetNetworkGroupCommand({
        ownerId: support.organisationId,
        networkGroupId: 'ng_00000000-0000-0000-0000-000000000000',
      }),
    );

    expect(response).toBeNull();
  });

  it('should list network groups', async () => {
    const application = await support.createTestApplication();
    const ng1 = await support.createNetworkGroup(application.id);
    const ng2 = await support.createNetworkGroup(application.id);

    const response = await support.client.send(
      new ListNetworkGroupCommand({
        ownerId: support.organisationId,
      }),
    );

    expect(response).toHaveLength(2);
    expect(response).toEqualInAnyOrder([ng1, ng2]);
  });

  it('should list network groups empty', async () => {
    const response = await support.client.send(
      new ListNetworkGroupCommand({
        ownerId: support.organisationId,
      }),
    );

    expect(response).toHaveLength(0);
  });

  it('should create network group', async () => {
    const application = await support.createTestApplication();

    const response = await support.createNetworkGroup(application.id);

    expect(response.id).toMatch(/ng_.+/);
    expect(response.ownerId).toBe(support.organisationId);
  });

  it('should delete network group', async () => {
    const application = await support.createTestApplication();
    const createdNetworkGroup = await support.createNetworkGroup(application.id);

    const response = await support.client.send(
      new DeleteNetworkGroupCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
      }),
    );

    expect(response).toBeNull();
  });

  it('should create network group member', async () => {
    const application = await support.createTestApplication();
    const createdNetworkGroup = await support.createNetworkGroup();

    const response = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: application.id,
        label: 'label',
      }),
    );

    expect(response.id).toBe(application.id);
    expect(response.kind).toBe('APPLICATION');
    expect(response.label).toBe('label');
  });

  it('should delete network group member', async () => {
    const application = await support.createTestApplication();
    const createdNetworkGroup = await support.createNetworkGroup(application.id);

    const response = await support.client.send(
      new DeleteNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: application.id,
      }),
    );

    expect(response).toBeNull();
  });

  it('should create network group external peer', async () => {
    const createdNetworkGroup = await support.createNetworkGroup();
    const member = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: await generateExternalMemberId(),
        label: 'label',
      }),
    );

    const response = await support.client.send(
      new CreateNetworkGroupExternalPeerCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        parentMember: member.id,
        label: 'label',
        peerRole: 'CLIENT',
        publicKey: 'publicKey',
      }),
    );

    expect(response.type).toBe('ExternalPeer');
    expect(response.parentMember).toBe(member.id);
    expect(response.publicKey).toBe('publicKey');
    expect(response.label).toBe('label');
    expect(response.endpoint.type).toBe('ClientEndpoint');
  });

  it('should delete network group external peer', async () => {
    const createdNetworkGroup = await support.createNetworkGroup();
    const member = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: await generateExternalMemberId(),
        label: 'label',
      }),
    );
    const externalPeer = await support.client.send(
      new CreateNetworkGroupExternalPeerCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        parentMember: member.id,
        label: 'label',
        peerRole: 'CLIENT',
        publicKey: 'publicKey',
      }),
    );

    const response = await support.client.send(
      new DeleteNetworkGroupExternalPeerCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        externalPeerId: externalPeer.id,
      }),
    );

    expect(response).toBeNull();
  });

  it('should get network group peer wireguard config', async () => {
    const createdNetworkGroup = await support.createNetworkGroup();
    const member = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: await generateExternalMemberId(),
        label: 'label',
      }),
    );
    const externalPeer = await support.client.send(
      new CreateNetworkGroupExternalPeerCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        parentMember: member.id,
        label: 'label',
        peerRole: 'CLIENT',
        publicKey: 'publicKey',
      }),
    );

    const response = await support.client.send(
      new GetNetworkGroupWireguardConfigurationCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        peerId: externalPeer.id,
      }),
    );

    expect(response).toBeTypeOf('string');
  });

  it('should get network group peer wireguard config url', async () => {
    const createdNetworkGroup = await support.createNetworkGroup();
    const member = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: await generateExternalMemberId(),
        label: 'label',
      }),
    );
    const externalPeer = await support.client.send(
      new CreateNetworkGroupExternalPeerCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        parentMember: member.id,
        label: 'label',
        peerRole: 'CLIENT',
        publicKey: 'publicKey',
      }),
    );

    const response = await support.client.send(
      new GetNetworkGroupWireguardConfigurationUrlCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        peerId: externalPeer.id,
      }),
    );

    expect(response.url).toBeTypeOf('string');
    expect(() => new URL(response.url)).not.toThrow();
    expect(response.url).toContain(createdNetworkGroup.id);
    expect(response.url).toContain(externalPeer.id);
  });

  it('should search network groups', async () => {
    const createdNetworkGroup = await support.createNetworkGroup(null, 'myNg-network group');
    const member = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: await generateExternalMemberId(),
        label: 'myNg-member',
      }),
    );
    await support.client.send(
      new CreateNetworkGroupExternalPeerCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        parentMember: member.id,
        label: 'myNg-external peer',
        peerRole: 'CLIENT',
        publicKey: 'publicKey',
      }),
    );

    const response = await support.client.send(
      new SearchNetworkGroupCommand({
        ownerId: support.organisationId,
        query: 'myNg',
      }),
    );

    expect(response).toHaveLength(3);
  });

  it('should search network groups with type filters', async () => {
    const createdNetworkGroup = await support.createNetworkGroup(null, 'myNg-network group');
    const member = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: await generateExternalMemberId(),
        label: 'myNg-member',
      }),
    );
    await support.client.send(
      new CreateNetworkGroupExternalPeerCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        parentMember: member.id,
        label: 'myNg-external peer',
        peerRole: 'CLIENT',
        publicKey: 'publicKey',
      }),
    );

    const response = await support.client.send(
      new SearchNetworkGroupCommand({
        ownerId: support.organisationId,
        query: 'myNg',
        types: ['NetworkGroup', 'ExternalPeer'],
      }),
    );

    expect(response).toHaveLength(2);
  });

  it('should create network group member with es-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'es-addon',
      planId: 'plan_0e0bc5ea-ba21-41e8-865b-1ed48e0163ca',
      zone: 'par',
      name: 'test-ng-es-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup();

    const response = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
        label: 'label',
      }),
    );

    expect(response.id).toBe(addon.realId);
    expect(response.kind).toBe('ADDON');
    expect(response.label).toBe('label');
  });

  it('should delete network group member with es-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'es-addon',
      planId: 'plan_0e0bc5ea-ba21-41e8-865b-1ed48e0163ca',
      zone: 'par',
      name: 'test-ng-es-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup(addon.realId);

    const response = await support.client.send(
      new DeleteNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
      }),
    );

    expect(response).toBeNull();
  });

  it('should create network group member with mongodb-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mongodb-addon',
      planId: 'plan_b53983a2-63d3-472d-8c98-f1bdea682912',
      zone: 'par',
      name: 'test-ng-mongodb-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup();

    const response = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
        label: 'label',
      }),
    );

    expect(response.id).toBe(addon.realId);
    expect(response.kind).toBe('ADDON');
    expect(response.label).toBe('label');
  });

  it('should delete network group member with mongodb-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mongodb-addon',
      planId: 'plan_b53983a2-63d3-472d-8c98-f1bdea682912',
      zone: 'par',
      name: 'test-ng-mongodb-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup(addon.realId);

    const response = await support.client.send(
      new DeleteNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
      }),
    );

    expect(response).toBeNull();
  });

  it('should create network group member with mysql-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mysql-addon',
      planId: 'plan_7ab494e2-c319-4330-8170-35d78738c1ee',
      zone: 'par',
      name: 'test-ng-mysql-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup();

    const response = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
        label: 'label',
      }),
    );

    expect(response.id).toBe(addon.realId);
    expect(response.kind).toBe('ADDON');
    expect(response.label).toBe('label');
  });

  it('should delete network group member with mysql-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'mysql-addon',
      planId: 'plan_7ab494e2-c319-4330-8170-35d78738c1ee',
      zone: 'par',
      name: 'test-ng-mysql-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup(addon.realId);

    const response = await support.client.send(
      new DeleteNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
      }),
    );

    expect(response).toBeNull();
  });

  it('should create network group member with postgresql-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'postgresql-addon',
      planId: 'plan_c32d00fb-6c06-48a9-a0a3-9d808937ec68',
      zone: 'par',
      name: 'test-ng-postgresql-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup();

    const response = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
        label: 'label',
      }),
    );

    expect(response.id).toBe(addon.realId);
    expect(response.kind).toBe('ADDON');
    expect(response.label).toBe('label');
  });

  it('should delete network group member with postgresql-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'postgresql-addon',
      planId: 'plan_c32d00fb-6c06-48a9-a0a3-9d808937ec68',
      zone: 'par',
      name: 'test-ng-postgresql-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup(addon.realId);

    const response = await support.client.send(
      new DeleteNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
      }),
    );

    expect(response).toBeNull();
  });

  it('should create network group member with redis-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'redis-addon',
      planId: 'plan_c62dd71e-15c3-483e-879d-75e4c836e21e',
      zone: 'par',
      name: 'test-ng-redis-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup();

    const response = await support.client.send(
      new CreateNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
        label: 'label',
      }),
    );

    expect(response.id).toBe(addon.realId);
    expect(response.kind).toBe('ADDON');
    expect(response.label).toBe('label');
  });

  it('should delete network group member with redis-addon addon', async () => {
    const addon = await support.createTestAddon({
      providerId: 'redis-addon',
      planId: 'plan_c62dd71e-15c3-483e-879d-75e4c836e21e',
      zone: 'par',
      name: 'test-ng-redis-addon',
    });
    const createdNetworkGroup = await support.createNetworkGroup(addon.realId);

    const response = await support.client.send(
      new DeleteNetworkGroupMemberCommand({
        ownerId: support.organisationId,
        networkGroupId: createdNetworkGroup.id,
        memberId: addon.realId,
      }),
    );

    expect(response).toBeNull();
  });
});
