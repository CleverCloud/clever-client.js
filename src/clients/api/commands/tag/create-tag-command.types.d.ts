import { type ApplicationOrAddonId } from '../../types/cc-api.types.js';

export type CreateTagCommandInput = ApplicationOrAddonId & {
  tag: string;
};

export type CreateTagCommandOutput = Array<string>;
