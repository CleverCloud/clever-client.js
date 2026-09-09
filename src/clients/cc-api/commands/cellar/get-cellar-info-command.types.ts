import type { AddonId } from '../../types/cc-api.types.js';
import type { CellarInfo } from './cellar.types.js';

/**
 * Identifies the Cellar add-on to read. The owner is resolved automatically when omitted.
 */
export type GetCellarInfoCommandInput = AddonId;

/**
 * The requested add-on, with its usage counters.
 */
export type GetCellarInfoCommandOutput = CellarInfo;
