export type CheckMetabaseVersionCommandInput = {
  addonId: string;
};

export type CheckMetabaseVersionCommandOutput = {
  installed: string;
  // renamed from available
  availableVersions: Array<string>;
  latest: string;
  needUpdate: boolean;
};
