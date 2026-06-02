import type { MetabaseInfo } from './metabase.types.js';

export type UpdateMetabaseVersionCommandInput = {
  addonId: string;
  targetVersion: string;
};

export type UpdateMetabaseVersionCommandOutput = MetabaseInfo;
