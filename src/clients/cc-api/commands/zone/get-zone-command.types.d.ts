import type { Zone } from './zone.types.js';

export type GetZoneCommandInput = {
  zoneName: string;
  ownerId?: string;
};

export type GetZoneCommandOutput = Zone;
