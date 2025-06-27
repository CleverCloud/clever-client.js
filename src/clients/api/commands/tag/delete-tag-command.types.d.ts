import { type ApplicationOrAddonId } from '../../types/cc-api.types.js';

export interface DeleteTagCommandInput extends ApplicationOrAddonId & {
  tag: string;
};

export type DeleteTagCommandOutput = Array<string>;
