import type { ApplicationOrAddonId } from '../../types/cc-api.types.ts';

/**
 * Identifies the application or add-on to untag, along with the tag to remove.
 */
export type DeleteTagCommandInput = ApplicationOrAddonId & {
  /** Tag to remove. */
  tag: string;
};

/**
 * The tags left on the resource, sorted.
 */
export type DeleteTagCommandOutput = Array<string>;
