import type { ApplicationId } from '../../types/cc-api.types.js';

/**
 * Which application to add a link to, and what to link it to.
 */
export type AddLinkCommandInput = AddApplicationToApplicationLinkCommandInput | AddApplicationToAddonLinkCommandInput;

/**
 * Links an application to another application, so it sees the configuration that one exposes.
 */
export interface AddApplicationToApplicationLinkCommandInput extends ApplicationId {
  /** Identifier of the application to link to. */
  targetApplicationId: string;
}

/**
 * Links an application to an add-on, so it sees the add-on's connection details.
 */
export interface AddApplicationToAddonLinkCommandInput extends ApplicationId {
  /** Identifier of the add-on to link to. */
  targetAddonId: string;
}
