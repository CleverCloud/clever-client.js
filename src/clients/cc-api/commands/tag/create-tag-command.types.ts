import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the application or add-on to tag, along with the tag to add.
 */
export type CreateTagCommandInput = ApplicationOrAddonId & {
  /** Tag to add. */
  tag: string;
};

/**
 * Every tag on the resource once the new one has been added, sorted.
 */
export type CreateTagCommandOutput = Array<string>;
