import { transformAddon } from '../addon/addon-transform.js';
import { transformApplication } from '../application/application-transform.js';
import type { LinkToAddon, LinkToApplication } from './link.types.js';

export function transformLinkToApplication(payload: any): LinkToApplication {
  return {
    type: 'link-to-application',
    application: transformApplication(payload),
  };
}

export function transformLinkToAddon(payload: any): LinkToAddon {
  return {
    type: 'link-to-addon',
    addon: transformAddon(payload),
  };
}
