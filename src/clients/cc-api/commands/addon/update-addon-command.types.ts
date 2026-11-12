import type { AddonId } from '../../types/cc-api.types.ts';
import type { Addon } from './addon.types.ts';

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
