import type { Addon } from '../addon/addon.types.js';
import type { Application } from '../application/application.types.js';

export type Link = LinkToApplication | LinkToAddon;

export interface LinkToApplication {
  type: 'link-to-application';
  application: Application;
}

export interface LinkToAddon {
  type: 'link-to-addon';
  addon: Addon;
}
