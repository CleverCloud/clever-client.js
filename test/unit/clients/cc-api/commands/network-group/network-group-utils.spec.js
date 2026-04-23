import { expect } from 'chai';
import {
  NETWORK_GROUP_SUPPORTED_ADDON_PROVIDERS,
  constructNetworkGroupMember,
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
    for (const providerId of NETWORK_GROUP_SUPPORTED_ADDON_PROVIDERS.keys()) {
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

describe('constructNetworkGroupMember', () => {
  const NG_ID = 'ng_test-ng-id';

  it('should return kind APPLICATION for an app_ member id', () => {
    const member = constructNetworkGroupMember(NG_ID, 'app_abc123');
    expect(member.kind).to.equal('APPLICATION');
  });

  it('should return kind EXTERNAL for an external_ member id', () => {
    const member = constructNetworkGroupMember(NG_ID, 'external_abc123');
    expect(member.kind).to.equal('EXTERNAL');
  });

  it('should return kind ADDON for each supported addon realId prefix', () => {
    const realIdPrefixes = [...NETWORK_GROUP_SUPPORTED_ADDON_PROVIDERS.values()];
    for (const prefix of realIdPrefixes) {
      const memberId = `${prefix}abc123`;
      const member = constructNetworkGroupMember(NG_ID, memberId);
      expect(member.kind, `realId prefix: ${prefix}`).to.equal('ADDON');
    }
  });

  it('should throw for a legacy addon_ id (regression: addon_ is no longer accepted)', () => {
    expect(() => constructNetworkGroupMember(NG_ID, 'addon_abc123')).to.throw();
  });

  it('should throw for a completely unknown member id prefix', () => {
    expect(() => constructNetworkGroupMember(NG_ID, 'unknown_abc123')).to.throw();
  });

  it('should build the correct domainName', () => {
    const member = constructNetworkGroupMember(NG_ID, 'app_abc123');
    expect(member.domainName).to.equal('app_abc123.m.ng_test-ng-id.cc-ng.cloud');
  });

  it('should echo back the member id', () => {
    const member = constructNetworkGroupMember(NG_ID, 'app_abc123');
    expect(member.id).to.equal('app_abc123');
  });
});
