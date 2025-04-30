/**
 * @import { NetworkGroup, NetworkGroupMember, NetworkGroupPeer } from './network-group.types.js'
 * @import { CcApiType, CcApiCommand } from '../../types/cc-api.types.js'
 * @import { Composer } from '../../../../types/command.types.js'
 */
import { randomUUID } from '../../../../lib/utils.js';
import { isTimeoutError, Polling } from '../../../../utils/polling.js';
import { GetNetworkGroupCommand } from './get-network-group-command.js';
import { GetNetworkGroupMemberCommand } from './get-network-group-member-command.js';
import { GetNetworkGroupPeerCommand } from './get-network-group-peer-command.js';

const POLLING_TIMEOUT_MS = 30_000;
const POLLING_INTERVAL_MS = 1000;
const DOMAIN = 'cc-ng.cloud';

/**
 * @param {Composer<CcApiType>} composer
 * @param {string} ownerId
 * @param {string} networkGroupId
 * @returns {Promise<NetworkGroup>}
 */
export async function waitForNetworkGroupCreation(composer, ownerId, networkGroupId) {
  return waitForCreation(composer, new GetNetworkGroupCommand({ ownerId, networkGroupId }), 'Network group');
}

/**
 * @param {Composer<CcApiType>} composer
 * @param {string} ownerId
 * @param {string} networkGroupId
 * @returns {Promise<void>}
 */
export async function waitForNetworkGroupDeletion(composer, ownerId, networkGroupId) {
  return waitForDeletion(composer, new GetNetworkGroupCommand({ ownerId, networkGroupId }), 'Network group');
}

/**
 * @param {Composer<CcApiType>} composer
 * @param {string} ownerId
 * @param {string} networkGroupId
 * @param {string} memberId
 * @returns {Promise<NetworkGroupMember>}
 */
export async function waitForNetworkGroupMemberCreation(composer, ownerId, networkGroupId, memberId) {
  return waitForCreation(
    composer,
    new GetNetworkGroupMemberCommand({ ownerId, networkGroupId, memberId }),
    'Network group member',
  );
}

/**
 * @param {Composer<CcApiType>} composer
 * @param {string} ownerId
 * @param {string} networkGroupId
 * @param {string} memberId
 * @returns {Promise<void>}
 */
export async function waitForNetworkGroupMemberDeletion(composer, ownerId, networkGroupId, memberId) {
  return waitForDeletion(
    composer,
    new GetNetworkGroupMemberCommand({ ownerId, networkGroupId, memberId }),
    'Network group member',
  );
}

/**
 * @param {Composer<CcApiType>} composer
 * @param {string} ownerId
 * @param {string} networkGroupId
 * @param {string} peerId
 * @returns {Promise<NetworkGroupPeer>}
 */
export async function waitForNetworkGroupPeerCreation(composer, ownerId, networkGroupId, peerId) {
  return waitForCreation(
    composer,
    new GetNetworkGroupPeerCommand({ ownerId, networkGroupId, peerId }),
    'Network group peer',
  );
}

/**
 * @param {Composer<CcApiType>} composer
 * @param {string} ownerId
 * @param {string} networkGroupId
 * @param {string} peerId
 * @returns {Promise<void>}
 */
export async function waitForNetworkGroupPeerDeletion(composer, ownerId, networkGroupId, peerId) {
  return waitForDeletion(
    composer,
    new GetNetworkGroupPeerCommand({ ownerId, networkGroupId, peerId }),
    'Network group peer',
  );
}

/**
 *
 * @param {string} ngId The Network Group ID
 * @param {string} memberId The member ID
 * @returns {Object}
 */
export function constructNetworkGroupMember(ngId, memberId) {
  return {
    id: memberId,
    domainName: getDomainName(ngId, memberId),
    kind: getKind(memberId),
  };
}

/**
 * @returns {Promise<string>}
 */
export async function generateNetworkGroupId() {
  return `ng_${await randomUUID()}`;
}

/**
 * @returns {Promise<string>}
 */
export async function generateExternalMemberId() {
  return `external_${await randomUUID()}`;
}

/**
 * @param {string} ngId
 * @param {string} memberId
 * @returns {string}
 */
function getDomainName(ngId, memberId) {
  return `${memberId}.m.${ngId}.${DOMAIN}`;
}

/**
 *
 * @param {string} memberId
 * @returns {'APPLICATION'|'ADDON'|'EXTERNAL'}
 */
function getKind(memberId) {
  if (memberId.startsWith('app_')) {
    return 'APPLICATION';
  }
  if (memberId.startsWith('addon_')) {
    return 'ADDON';
  }
  if (memberId.startsWith('external_')) {
    return 'EXTERNAL';
  }
  throw new Error(`Invalid member id "${memberId}". Member id must be "addon_xxx", "app_xxx" or "external_xxx"`);
}

/**
 *
 * @param {Composer<CcApiType>} composer
 * @param {CcApiCommand<?, T>} command
 * @param {string} entityName
 * @returns {Promise<T>}
 * @template T
 */
async function waitForCreation(composer, command, entityName) {
  const polling = new Polling(
    async () => {
      const result = await composer.send(command);
      if (result == null) {
        return { stop: false };
      } else {
        return { stop: true, value: result };
      }
    },
    POLLING_INTERVAL_MS,
    POLLING_TIMEOUT_MS,
  );

  try {
    return await polling.start();
  } catch (e) {
    if (isTimeoutError(e)) {
      throw new Error(`${entityName} creation has been requested but is not created yet`);
    } else {
      throw e;
    }
  }
}

/**
 *
 * @param {Composer<CcApiType>} composer
 * @param {CcApiCommand<?, ?>} command
 * @param {string} entityName
 * @returns {Promise<void>}
 */
async function waitForDeletion(composer, command, entityName) {
  const polling = new Polling(
    async () => {
      const result = await composer.send(command);
      return { stop: result == null };
    },
    POLLING_INTERVAL_MS,
    POLLING_TIMEOUT_MS,
  );

  try {
    await polling.start();
  } catch (e) {
    if (isTimeoutError(e)) {
      throw new Error(`${entityName} deletion has been requested but is not deleted yet`);
    } else {
      throw e;
    }
  }
}
