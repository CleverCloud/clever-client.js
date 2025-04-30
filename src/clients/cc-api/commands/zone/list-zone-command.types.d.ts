import type { Zone } from './zone.types.js';

export type ListZoneCommandInput = void | {
  ownerId: string;
};

export type ListZoneCommandOutput = Array<Zone>;
