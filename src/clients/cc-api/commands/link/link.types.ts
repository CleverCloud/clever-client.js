import type { Addon } from '../addon/addon.types.js';
import type { Application } from '../application/application.types.js';

/**
 * A dependency of an application: another application or an add-on whose configuration is injected
 * into the application's environment.
 */
export type Link = LinkToApplication | LinkToAddon;

/**
 * A link pointing at another application.
 */
export interface LinkToApplication {
  /** Discriminant of the link target. */
  type: 'link-to-application';
  /** The linked application, in full. */
  application: Application;
}

/**
 * A link pointing at an add-on.
 */
export interface LinkToAddon {
  /** Discriminant of the link target. */
  type: 'link-to-addon';
  /** The linked add-on, in full. */
  addon: Addon;
}
