/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups
 */
export function listNetworkGroups(params: { ownerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /networkgroups/organisations/{ownerId}/networkgroups
 */
export function createNetworkGroup(params: { ownerId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}
 */
export function deleteNetworkGroup(params: { ownerId: string; networkGroupId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}
 */
export function getNetworkGroup(params: { ownerId: string; networkGroupId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/external-peers
 */
export function createNetworkGroupExternalPeer(params: { ownerId: string; networkGroupId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/external-peers`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/external-peers/{peerId}
 */
export function deleteNetworkGroupExternalPeer(params: { ownerId: string; networkGroupId: string; peerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/external-peers/${params.peerId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members
 */
export function listNetworkGroupMembers(params: { ownerId: string; networkGroupId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * POST /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members
 */
export function createNetworkGroupMember(params: { ownerId: string; networkGroupId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * DELETE /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members/{memberId}
 */
export function deleteNetworkGroupMember(params: { ownerId: string; networkGroupId: string; memberId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members/${params.memberId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members/{memberId}
 */
export function getNetworkGroupMember(params: { ownerId: string; networkGroupId: string; memberId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/members/${params.memberId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/peers
 */
export function listNetworkGroupPeers(params: { ownerId: string; networkGroupId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * DELETE /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/peers/{peerId}
 */
export function deleteNetworkGroupPeer(params: { ownerId: string; networkGroupId: string; peerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/peers/{peerId}
 */
export function getNetworkGroupPeer(params: { ownerId: string; networkGroupId: string; peerId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/peers/{peerId}/wireguard/configuration
 */
export function getNetworkGroupWireGuardConfiguration(params: {
  ownerId: string;
  networkGroupId: string;
  peerId: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}/wireguard/configuration`,
    headers: { Accept: 'text/plain' },
    // no query params
    // no body
  });
}

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/peers/{peerId}/wireguard/configuration/stream
 */
export function getNetworkGroupWireGuardConfigurationStream(params: {
  ownerId: string;
  networkGroupId: string;
  peerId: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}/wireguard/configuration/stream`,
    headers: { Accept: 'text/event-stream' },
    // no query params
    // no body
  });
}

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/stream
 */
export function getNetworkGroupStream(params: { ownerId: string; networkGroupId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/stream`,
    headers: { Accept: 'text/event-stream' },
    // no query params
    // no body
  });
}
