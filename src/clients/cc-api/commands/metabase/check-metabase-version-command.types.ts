export type CheckMetabaseVersionCommandInput = {
  addonId: string;
};

export type CheckMetabaseVersionCommandOutput = {
  installed: string;
  available: Array<string>;
  latest: string;
  needUpdate: boolean;
};
