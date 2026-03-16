export interface CheckOtoroshiVersionCommandInput {
  addonId: string;
}

export type CheckOtoroshiVersionCommandOutput = {
  installed: string;
  available: Array<string>;
  latest: string;
  needUpdate: boolean;
};
