import type { CellarObjectDetails, CellarObjectResourceId } from './cellar.types.js';

/**
 * Identifies the object to read.
 */
export type GetCellarObjectCommandInput = CellarObjectResourceId;

/**
 * The object metadata.
 */
export type GetCellarObjectCommandOutput = CellarObjectDetails;
