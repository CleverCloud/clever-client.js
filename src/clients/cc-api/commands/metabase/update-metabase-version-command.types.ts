import type { MetabaseInfo } from './metabase.types.js';

/**
 * Identifies the add-on to move, and the version to move it to.
 */
export type UpdateMetabaseVersionCommandInput = {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
  /** Version to move the instance to. Has to be one of the `availableVersions` of the version check. */
  targetVersion: string;
};

/**
 * The add-on as it stands once the update has been applied.
 */
export type UpdateMetabaseVersionCommandOutput = MetabaseInfo;
