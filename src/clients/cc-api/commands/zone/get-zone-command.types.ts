import type { Zone } from './zone.types.js';

/**
 * Identifies the zone to retrieve.
 */
export type GetZoneCommandInput = {
  /** Short name of the zone, for example `par`. */
  zoneName: string;
  /** Identifier of an organisation, to answer only if that organisation has access to the zone. */
  ownerId?: string;
};

/**
 * The requested zone.
 */
export type GetZoneCommandOutput = Zone;
