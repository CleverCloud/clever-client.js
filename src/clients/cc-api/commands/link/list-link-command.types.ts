import type { AddonId, ApplicationId } from '../../types/cc-api.types.js';
import type { Link } from './link.types.js';

export type ListLinkCommandInput = ListApplicationLinkCommandInput | ListAddonLinkCommandInput;

export type ListApplicationLinkCommandInput = ApplicationId;
export type ListAddonLinkCommandInput = AddonId;

// transformed: sorted by the linked resource's name, then id
export type ListLinkCommandOutput = Array<Link>;
