import type { Addon } from './addon.types.ts';

/**
 * Identifies the organisation whose add-ons are listed.
 */
export interface ListAddonCommandInput {
  /** Identifier of the organisation owning the add-ons. */
  ownerId: string;
}

/**
 * The add-ons of the organisation, sorted by name.
 */
export type ListAddonCommandOutput = Array<Addon>;
