import { type ApplicationOrAddonId } from '../../types/cc-api.types.js';

export type DeleteTagCommandInput = ApplicationOrAddonId & {
  tag: string;
};

export type DeleteTagCommandOutput = Array<string>;
