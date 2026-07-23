import type { AddonId, ApplicationId } from '../../types/cc-api.types.js';
import type { Link } from './link.types.js';

/**
 * Whose links to list: an application's dependencies, or the applications an add-on is linked to.
 */
export type ListLinkCommandInput = ListApplicationLinkCommandInput | ListAddonLinkCommandInput;

/**
 * Lists what an application is linked to.
 */
export type ListApplicationLinkCommandInput = ApplicationId;

/**
 * Lists the applications linked to an add-on.
 */
export type ListAddonLinkCommandInput = AddonId;

/**
 * The links, sorted by the linked resource's name then by its id.
 */
export type ListLinkCommandOutput = Array<Link>;
