import { expect } from 'chai';
import {
  NETWORK_GROUP_SUPPORTED_ADDON_PROVIDER_IDS,
  isNetworkGroupAddonCandidate,
} from '../../../../../../src/clients/cc-api/commands/network-group/network-group-utils.js';

/**
 * @param {{ providerId?: string, planSlug?: string }} [overrides]
 * @returns {import('../../../../../../src/clients/cc-api/commands/addon/addon.types.js').Addon}
 */
function makeAddon({ providerId = 'postgresql-addon', planSlug = 'xsmall' } = {}) {
  return /** @type {any} */ ({ provider: { id: providerId }, plan: { slug: planSlug } });
}

describe('isNetworkGroupAddonCandidate', () => {
  it('should return true for each of the 5 supported providers with a non-dev plan', () => {
    for (const providerId of NETWORK_GROUP_SUPPORTED_ADDON_PROVIDER_IDS) {
      const addon = makeAddon({ providerId, planSlug: 'xsmall' });
      expect(isNetworkGroupAddonCandidate(addon), `provider: ${providerId}`).to.equal(true);
    }
  });

  it('should return false for a supported provider with plan slug "dev"', () => {
    const addon = makeAddon({ providerId: 'postgresql-addon', planSlug: 'dev' });
    expect(isNetworkGroupAddonCandidate(addon)).to.equal(false);
  });

  it('should return false for an unsupported provider (keycloak)', () => {
    const addon = makeAddon({ providerId: 'keycloak', planSlug: 'xsmall' });
    expect(isNetworkGroupAddonCandidate(addon)).to.equal(false);
  });

  it('should return false for an unsupported provider (addon-pulsar)', () => {
    const addon = makeAddon({ providerId: 'addon-pulsar', planSlug: 'xsmall' });
    expect(isNetworkGroupAddonCandidate(addon)).to.equal(false);
  });

  it('should return false for an unsupported provider with dev plan', () => {
    const addon = makeAddon({ providerId: 'fs-bucket', planSlug: 'dev' });
    expect(isNetworkGroupAddonCandidate(addon)).to.equal(false);
  });
});
