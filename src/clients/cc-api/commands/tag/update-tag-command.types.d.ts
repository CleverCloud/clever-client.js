import { type ApplicationOrAddonId } from '../../types/cc-api.types.js';

export type UpdateTagCommandInput = ApplicationOrAddonId & {
  tags: Array<string>;
};

export type UpdateTagCommandOutput = Array<string>;
