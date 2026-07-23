import type { Zone } from './zone.types.js';

export type ListZoneCommandInput = void | {
  ownerId: string;
};

// transformed: sorted by name
export type ListZoneCommandOutput = Array<Zone>;
