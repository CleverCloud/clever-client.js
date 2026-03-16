import type { MetabaseInfo } from './metabase.types.js';

export type GetMetabaseInfoCommandInput = {
  addonId: string;
};

export type GetMetabaseInfoCommandOutput = MetabaseInfo;
