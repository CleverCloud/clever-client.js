import type { Notice } from './notice.types.js';

/**
 * Takes no parameter: the home page notices are the same for every organisation.
 */
export type ListHomeNoticeCommandInput = void;

/**
 * The notices to show on the home page, oldest first. Empty when there is nothing to show.
 */
export type ListHomeNoticeCommandOutput = Array<Notice>;
