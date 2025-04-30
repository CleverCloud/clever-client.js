/**
 * @import { LinkToApplication, LinkToAddon } from './link.types.js';
 */
import { transformAddon } from '../addon/addon-transform.js';
import { transformApplication } from '../application/application-transform.js';

/**
 * @param {string} payload
 * @returns {LinkToApplication}
 */
export function transformLinkToApplication(payload) {
  return {
    type: 'link-to-application',
    application: transformApplication(payload),
  };
}

/**
 * @param {string} payload
 * @returns {LinkToAddon}
 */
export function transformLinkToAddon(payload) {
  return {
    type: 'link-to-addon',
    addon: transformAddon(payload),
  };
}
