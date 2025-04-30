import { AddonId } from '../../types/cc-api.types.js';
import type { Addon } from './addon.types.js';

export interface GetAddonCommandInput extends AddonId {}

export type GetAddonCommandOutput = Addon;
