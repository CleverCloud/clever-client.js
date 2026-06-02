import { AddonId, type ApplicationId } from '../../types/cc-api.types.js';
import type { Link } from './link.types.js';

export type ListLinkCommandInput = ListApplicationLinkCommandInput | ListAddonLinkCommandInput;

export interface ListApplicationLinkCommandInput extends ApplicationId {}
export interface ListAddonLinkCommandInput extends AddonId {}

export type ListLinkCommandOutput = Array<Link>;
