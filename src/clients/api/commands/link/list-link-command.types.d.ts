import { AddonId, type ApplicationId } from '../../types/cc-api.types.js';
import type { Addon } from '../addon/addon.types.js';
import type { Application } from '../application/application.types.js';

export type ListLinkCommandInput = ListApplicationLinkCommandInput | ListAddonLinkCommandInput;

export interface ListApplicationLinkCommandInput extends ApplicationId {}
export interface ListAddonLinkCommandInput extends AddonId {}

export type ListLinkCommandOutput = Array<LinkToApplication | LinkToAddon>;

export interface LinkToApplication {
  type: 'application';
  application: Application;
}
export interface LinkToAddon {
  type: 'addon';
  addon: Addon;
}
