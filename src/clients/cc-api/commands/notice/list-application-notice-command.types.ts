import type { Notice } from './notice.types.js';

/**
 * Identifies the application whose overview notices are listed.
 */
export type ListApplicationNoticeCommandInput = {
  /** Identifier of the application. */
  applicationId: string;
};

/**
 * The notices to show on the application overview, oldest first. Empty when there is nothing to show.
 */
export type ListApplicationNoticeCommandOutput = Array<Notice>;
