import type { Notice } from './notice.types.ts';

/**
 * Identifies the organisation the add-on is being created in and the add-on provider the user picked.
 */
export type ListAddonCreationConfigurationNoticeCommandInput = {
  /**
   * Identifier of the organisation.
   * @sentAs `orgaId`
   */
  ownerId: string;
  /** Identifier of the chosen add-on provider, for example `postgresql-addon`. */
  addonProviderId: string;
};

/**
 * The notices to show while configuring the add-on, oldest first. Empty when there is nothing to show.
 */
export type ListAddonCreationConfigurationNoticeCommandOutput = Array<Notice>;
