import type { Zone } from './zone.types.js';

/**
 * Which zones to list: pass nothing for the public zones, or an owner to get the ones that
 * organisation has access to.
 */
export type ListZoneCommandInput = void | {
  /** Identifier of the user or organisation to filter the zones for. */
  ownerId: string;
};

/**
 * The zones, sorted by name.
 */
export type ListZoneCommandOutput = Array<Zone>;
