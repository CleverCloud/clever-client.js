import { AddonId } from '../../types/cc-api.types.js';
import type { Addon } from './addon.types.js';

export interface UpdateAddonCommandInput extends AddonId {
  name: string;
}

export type UpdateAddonCommandOutput = Addon;
