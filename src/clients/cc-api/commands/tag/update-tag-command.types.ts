import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the application or add-on to retag, along with the full set of tags it should end up with.
 */
export type UpdateTagCommandInput = ApplicationOrAddonId & {
  /**
   * Tags the resource should end up with.
   * @sentAs the whole request body
   */
  tags: Array<string>;
};

/**
 * The tags on the resource once the replacement went through, sorted.
 */
export type UpdateTagCommandOutput = Array<string>;
