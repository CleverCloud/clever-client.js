import type { Notice } from './notice.types.js';

/**
 * Identifies the add-on whose overview notices are listed.
 */
export type ListAddonNoticeCommandInput = {
  /** Identifier of the add-on, either its `addon_` id or its real id. */
  addonId: string;
};

/**
 * The notices to show on the add-on overview, oldest first. Empty when there is nothing to show.
 */
export type ListAddonNoticeCommandOutput = Array<Notice>;
