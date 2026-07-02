import type { AddonId } from '../../types/cc-api.types.js';
import type { Addon } from './addon.types.js';

export type GetAddonCommandInput = AddonId;

export type GetAddonCommandOutput = Addon;
