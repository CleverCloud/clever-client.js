import { randomUUID } from '../../../../lib/utils.js';
import type { Composer } from '../../../../types/command.types.js';
import { isTimeoutError, Polling } from '../../../../utils/polling.js';
import type { CcApiCommand, CcApiType } from '../../types/cc-api.types.js';
import type { Addon } from '../addon/addon.types.js';
import { GetNetworkGroupCommand } from './get-network-group-command.js';
import { GetNetworkGroupMemberCommand } from './get-network-group-member-command.js';
import { GetNetworkGroupPeerCommand } from './get-network-group-peer-command.js';
import type { NetworkGroup, NetworkGroupMember, NetworkGroupPeer } from './network-group.types.js';

const POLLING_TIMEOUT_MS = 30_000;
const POLLING_INTERVAL_MS = 1000;
const DOMAIN = 'cc-ng.cloud';

export async function waitForNetworkGroupCreation(
  composer: Composer<CcApiType>,
  ownerId: string,
  networkGroupId: string,
): Promise<NetworkGroup> {
  return waitForCreation(composer, new GetNetworkGroupCommand({ ownerId, networkGroupId }), 'Network group');
}

export async function waitForNetworkGroupDeletion(
  composer: Composer<CcApiType>,
  ownerId: string,
  networkGroupId: string,
): Promise<void> {
  return waitForDeletion(composer, new GetNetworkGroupCommand({ ownerId, networkGroupId }), 'Network group');
}

export async function waitForNetworkGroupMemberCreation(
  composer: Composer<CcApiType>,
  ownerId: string,
  networkGroupId: string,
  memberId: string,
): Promise<NetworkGroupMember> {
  return waitForCreation(
    composer,
    new GetNetworkGroupMemberCommand({ ownerId, networkGroupId, memberId }),
    'Network group member',
  );
}

export async function waitForNetworkGroupMemberDeletion(
  composer: Composer<CcApiType>,
  ownerId: string,
  networkGroupId: string,
  memberId: string,
): Promise<void> {
  return waitForDeletion(
    composer,
    new GetNetworkGroupMemberCommand({ ownerId, networkGroupId, memberId }),
    'Network group member',
  );
}

export async function waitForNetworkGroupPeerCreation(
  composer: Composer<CcApiType>,
  ownerId: string,
  networkGroupId: string,
  peerId: string,
): Promise<NetworkGroupPeer> {
  return waitForCreation(
    composer,
    new GetNetworkGroupPeerCommand({ ownerId, networkGroupId, peerId }),
    'Network group peer',
  );
}

export async function waitForNetworkGroupPeerDeletion(
  composer: Composer<CcApiType>,
  ownerId: string,
  networkGroupId: string,
  peerId: string,
): Promise<void> {
  return waitForDeletion(
    composer,
    new GetNetworkGroupPeerCommand({ ownerId, networkGroupId, peerId }),
    'Network group peer',
  );
}

/**
 * Returns a copy of the given member with its `kind` normalized to uppercase.
 *
 * The Clever Cloud API may return the member `kind` in lower or mixed case; this
 * guarantees it is always one of `'APPLICATION' | 'ADDON' | 'EXTERNAL'`.
 */
export function normalizeMemberKind<T extends { kind: string }>(member: T): T & { kind: NetworkGroupMember['kind'] } {
  return {
    ...member,
    kind: member.kind.toUpperCase() as NetworkGroupMember['kind'],
  };
}

/**
 * @param ngId The Network Group ID
 * @param memberId The member ID
 */
export function constructNetworkGroupMember(ngId: string, memberId: string): Omit<NetworkGroupMember, 'label'> {
  return {
    id: memberId,
    domainName: getDomainName(ngId, memberId),
    kind: getKind(memberId),
  };
}

export async function generateNetworkGroupId(): Promise<string> {
  return `ng_${await randomUUID()}`;
}

export async function generateExternalMemberId(): Promise<string> {
  return `external_${await randomUUID()}`;
}

function getDomainName(ngId: string, memberId: string): string {
  return `${memberId}.m.${ngId}.${DOMAIN}`;
}

function getKind(memberId: string): 'APPLICATION' | 'ADDON' | 'EXTERNAL' {
  if (memberId.startsWith('app_')) {
    return 'APPLICATION';
  }
  if (memberId.startsWith('external_')) {
    return 'EXTERNAL';
  }
  for (const realIdPrefix of NETWORK_GROUP_SUPPORTED_ADDON_PROVIDERS.values()) {
    if (memberId.startsWith(realIdPrefix)) {
      return 'ADDON';
    }
  }
  const validPrefixes = [...NETWORK_GROUP_SUPPORTED_ADDON_PROVIDERS.values(), 'app_', 'external_']
    .map((p) => `"${p}xxx"`)
    .join(', ');
  throw new Error(`Invalid member id "${memberId}". Member id must start with one of: ${validPrefixes}`);
}

/**
 * Maps each supported addon provider ID to the realId prefix used by the Clever Cloud API.
 * Both facts (supported providers and their realId prefixes) are kept here to prevent drift.
 *
 * key   — provider ID (e.g. 'postgresql-addon')
 * value — realId prefix (e.g. 'postgresql_')
 */
export const NETWORK_GROUP_SUPPORTED_ADDON_PROVIDERS = new Map<string, string>([
  ['es-addon', 'elasticsearch_'],
  ['mongodb-addon', 'mongodb_'],
  ['mysql-addon', 'mysql_'],
  ['postgresql-addon', 'postgresql_'],
  ['redis-addon', 'redis_'],
]);

/**
 * Returns true if the given addon is a valid network group member candidate.
 * An addon is a valid candidate if:
 * - Its provider ID is in NETWORK_GROUP_SUPPORTED_ADDON_PROVIDERS
 * - Its plan slug is not "dev"
 */
export function isNetworkGroupAddonCandidate(addon: Addon): boolean {
  return NETWORK_GROUP_SUPPORTED_ADDON_PROVIDERS.has(addon.provider.id) && addon.plan.slug !== 'dev';
}

async function waitForCreation<T>(
  composer: Composer<CcApiType>,
  command: CcApiCommand<unknown, T>,
  entityName: string,
): Promise<T> {
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

async function waitForDeletion(
  composer: Composer<CcApiType>,
  command: CcApiCommand<unknown, unknown>,
  entityName: string,
): Promise<void> {
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
