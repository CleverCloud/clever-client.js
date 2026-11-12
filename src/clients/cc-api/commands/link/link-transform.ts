import { transformAddon } from '../addon/addon-transform.ts';
import { transformApplication } from '../application/application-transform.ts';
import type { LinkToAddon, LinkToApplication } from './link.types.ts';

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
