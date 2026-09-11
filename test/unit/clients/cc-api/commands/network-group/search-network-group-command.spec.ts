import { describe, expect, it } from 'vitest';
import { GetNetworkGroupCommand } from '../../../../../../src/clients/cc-api/commands/network-group/get-network-group-command.js';
import { SearchNetworkGroupCommand } from '../../../../../../src/clients/cc-api/commands/network-group/search-network-group-command.js';

/** A network group as the search route serialises it, with the `type` discriminator on top. */
function getNetworkGroupComponent() {
  return {
    type: 'NetworkGroup',
    id: 'ng_11111111-1111-1111-1111-111111111111',
    ownerId: 'orga_22222222-2222-2222-2222-222222222222',
    label: 'my-network-group',
    description: 'Some network group',
    networkIp: '10.0.0.0/16',
    lastAllocatedIp: '10.0.0.2',
    tags: [],
    version: 1,
    members: [
      {
        id: 'app_33333333-3333-3333-3333-333333333333',
        label: 'my-app',
        domainName: 'app_33333333-3333-3333-3333-333333333333.m.ng_11111111.cc-ng.cloud',
        kind: 'application',
      },
    ],
    peers: [
      {
        type: 'CleverPeer',
        id: 'peer_44444444-4444-4444-4444-444444444444',
        label: 'my-peer',
        publicKey: 'a-public-key',
        endpoint: { type: 'ClientEndpoint', ngIp: '10.0.0.2' },
        hostname: 'peer-44444444',
        parentMember: 'app_33333333-3333-3333-3333-333333333333',
        hv: 'hv_55555555-5555-5555-5555-555555555555',
      },
    ],
  };
}

describe('SearchNetworkGroupCommand', () => {
  it('should normalise the members and the peers of a matched network group', () => {
    const command = new SearchNetworkGroupCommand({ ownerId: 'orga_x', query: 'my' });

    const [component] = command.transformCommandOutput([getNetworkGroupComponent()]);

    expect(component.type).toBe('NetworkGroup');
    expect(component).toHaveProperty('members', [expect.objectContaining({ kind: 'APPLICATION' })]);
    expect(component).toHaveProperty('peers', [
      expect.objectContaining({ hypervisor: 'hv_55555555-5555-5555-5555-555555555555' }),
    ]);
  });

  // the same resource read twice has to come back the same way, whichever command brought it back
  it('should answer a matched network group like the get command does', () => {
    const { type: _type, ...networkGroupPayload } = getNetworkGroupComponent();
    const searchCommand = new SearchNetworkGroupCommand({ ownerId: 'orga_x', query: 'my' });
    const getCommand = new GetNetworkGroupCommand({ ownerId: 'orga_x', networkGroupId: networkGroupPayload.id });

    const [searched] = searchCommand.transformCommandOutput([getNetworkGroupComponent()]);
    const { type: _searchedType, ...searchedWithoutType } = searched;

    expect(searchedWithoutType).toEqual(getCommand.transformCommandOutput(networkGroupPayload));
  });
});
