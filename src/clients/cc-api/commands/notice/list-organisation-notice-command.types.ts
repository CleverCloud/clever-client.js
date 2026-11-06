import type { Notice } from './notice.types.js';

/**
 * Identifies the organisation whose overview notices are listed.
 */
export type ListOrganisationNoticeCommandInput = {
  /** Identifier of the organisation. */
  ownerId: string;
};

/**
 * The notices to show on the organisation overview, oldest first. Empty when there is nothing to show.
 */
export type ListOrganisationNoticeCommandOutput = Array<Notice>;
