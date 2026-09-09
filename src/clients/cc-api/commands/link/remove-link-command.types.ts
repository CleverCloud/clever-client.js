import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Which application to remove a link from, and which link to remove.
 */
export type RemoveLinkCommandInput =
  | RemoveApplicationToApplicationLinkCommandInput
  | RemoveApplicationToAddonLinkCommandInput;

/**
 * Unlinks an application from another application.
 */
export interface RemoveApplicationToApplicationLinkCommandInput extends ApplicationId {
  /** Identifier of the linked application to detach. */
  targetApplicationId: string;
}

/**
 * Unlinks an application from an add-on.
 */
export interface RemoveApplicationToAddonLinkCommandInput extends ApplicationId {
  /** Identifier of the linked add-on to detach. */
  targetAddonId: string;
}
