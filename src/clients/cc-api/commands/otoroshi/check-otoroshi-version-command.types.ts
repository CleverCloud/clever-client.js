export interface CheckOtoroshiVersionCommandInput {
  addonId: string;
}

export type CheckOtoroshiVersionCommandOutput = {
  installed: string;
  // renamed from available
  availableVersions: Array<string>;
  latest: string;
  needUpdate: boolean;
};
