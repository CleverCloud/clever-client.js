/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups
 * @param {Object} params
 * @param {String} params.ownerId
 * @returns {Promise<RequestParams>}
 */
export function listNetworkGroups(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createNetworkGroup(params, body) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @returns {Promise<RequestParams>}
 */
export function deleteNetworkGroup(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @returns {Promise<RequestParams>}
 */
export function getNetworkGroup(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createNetworkGroupExternalPeer(params, body) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @param {String} params.peerId
 * @returns {Promise<RequestParams>}
 */
export function deleteNetworkGroupExternalPeer(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @returns {Promise<RequestParams>}
 */
export function listNetworkGroupMembers(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function createNetworkGroupMember(params, body) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @param {String} params.memberId
 * @returns {Promise<RequestParams>}
 */
export function deleteNetworkGroupMember(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @param {String} params.memberId
 * @returns {Promise<RequestParams>}
 */
export function getNetworkGroupMember(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @returns {Promise<RequestParams>}
 */
export function listNetworkGroupPeers(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @param {String} params.peerId
 * @returns {Promise<RequestParams>}
 */
export function deleteNetworkGroupPeer(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @param {String} params.peerId
 * @returns {Promise<RequestParams>}
 */
export function getNetworkGroupPeer(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @param {String} params.peerId
 * @returns {Promise<RequestParams>}
 */
export function getNetworkGroupWireGuardConfiguration(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/peers/${params.peerId}/wireguard/configuration`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/peers/{peerId}/wireguard/configuration/stream
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @param {String} params.peerId
 * @returns {Promise<RequestParams>}
 */
export function getNetworkGroupWireGuardConfigurationStream(params) {
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
 * @param {Object} params
 * @param {String} params.ownerId
 * @param {String} params.networkGroupId
 * @returns {Promise<RequestParams>}
 */
export function getNetworkGroupStream(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/networkgroups/organisations/${params.ownerId}/networkgroups/${params.networkGroupId}/stream`,
    headers: { Accept: 'text/event-stream' },
    // no query params
    // no body
  });
}
