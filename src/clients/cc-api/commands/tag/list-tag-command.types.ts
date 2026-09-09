import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the application or add-on whose tags are listed.
 */
export type ListTagCommandInput = ApplicationOrAddonId;

/**
 * The tags attached to the resource, sorted. Empty when the API answers nothing.
 */
export type ListTagCommandOutput = Array<string>;
