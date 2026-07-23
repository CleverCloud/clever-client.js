export type CheckKeycloakVersionCommandInput = {
  addonId: string;
};

export type CheckKeycloakVersionCommandOutput = {
  installed: string;
  // renamed from available
  availableVersions: Array<string>;
  latest: string;
  needUpdate: boolean;
};
