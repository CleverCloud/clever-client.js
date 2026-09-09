import type { AddonId } from '../../types/cc-api.types.js';
import type { Addon } from './addon.types.js';

/**
 * Identifies the add-on to rename, along with its new name.
 */
export interface UpdateAddonCommandInput extends AddonId {
  /** New display name of the add-on. */
  name: string;
}

/**
 * The add-on as it stands after the rename.
 */
export type UpdateAddonCommandOutput = Addon;
