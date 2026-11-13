import type { ProviderNotice } from './notice.types.ts';

/**
 * Identifies the organisation the add-on is being created in.
 */
export type ListAddonCreationListNoticeCommandInput = {
  /**
   * Identifier of the organisation.
   * @sentAs `orgaId`
   */
  ownerId: string;
};

/**
 * The notices to show on the add-on provider list, oldest first. Empty when there is nothing to show.
 */
export type ListAddonCreationListNoticeCommandOutput = Array<ProviderNotice>;
