export type CheckKeycloakVersionCommandInput = {
  addonId: string;
};

export type CheckKeycloakVersionCommandOutput = {
  installed: string;
  available: Array<string>;
  latest: string;
  needUpdate: boolean;
};
