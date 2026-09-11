import { describe, expect, it } from 'vitest';
import { transformAddon } from '../../../../../../src/clients/cc-api/commands/addon/addon-transform.js';

/** A payload as `AddonView` serialises it, with the plain provider view `Addon.toView()` builds. */
function getAddonPayload() {
  return {
    id: 'addon_11111111-1111-1111-1111-111111111111',
    name: 'my-addon',
    realId: 'postgresql_22222222-2222-2222-2222-222222222222',
    region: 'par',
    zoneId: '33333333-3333-3333-3333-333333333333',
    provider: {
      id: 'postgresql-addon',
      name: 'PostgreSQL',
      website: 'https://www.postgresql.org',
      supportEmail: 'support@example.com',
      googlePlusName: '',
      twitterName: '@postgresql',
      analyticsId: 'postgresql',
      shortDesc: 'A relational database',
      longDesc: 'A relational database, at length',
      logoUrl: 'https://assets.example.com/postgresql.svg',
      status: 'RELEASE',
      openInNewTab: false,
      canUpgrade: true,
      regions: ['par', 'mtl'],
    },
    plan: {
      id: 'plan_44444444-4444-4444-4444-444444444444',
      name: 'XS Small Space',
      slug: 'xs',
      price: 5,
      price_id: 'PG_XS',
      features: [{ name: 'Memory', type: 'FILESIZE', value: '1 GB', computable_value: '1073741824', name_code: 'ram' }],
      zones: ['par'],
    },
    creationDate: 1757500000000,
    configKeys: ['POSTGRESQL_ADDON_URI', 'POSTGRESQL_ADDON_HOST'],
  };
}

describe('addon-transform', () => {
  describe('transformAddon', () => {
    it('should map the provider instead of publishing the payload', () => {
      const addon = transformAddon(getAddonPayload());

      expect(addon.provider).toEqual({
        id: 'postgresql-addon',
        name: 'PostgreSQL',
        website: 'https://www.postgresql.org',
        supportEmail: 'support@example.com',
        googlePlusName: '',
        twitterName: '@postgresql',
        analyticsId: 'postgresql',
        shortDescription: 'A relational database',
        longDescription: 'A relational database, at length',
        logoUrl: 'https://assets.example.com/postgresql.svg',
        status: 'RELEASE',
        shouldOpenInNewTab: false,
        canUpgrade: true,
        zones: ['par', 'mtl'],
      });
    });

    // the route serialises the plain provider view, so a key it carries is one the client kept
    it('should keep the provider payload keys out of the published provider', () => {
      const addon = transformAddon(getAddonPayload());

      expect(Object.keys(addon.provider)).not.toContain('shortDesc');
      expect(Object.keys(addon.provider)).not.toContain('longDesc');
      expect(Object.keys(addon.provider)).not.toContain('openInNewTab');
      expect(Object.keys(addon.provider)).not.toContain('regions');
    });

    it('should drop a provider key the client does not publish', () => {
      const payload = getAddonPayload();

      const addon = transformAddon({ ...payload, provider: { ...payload.provider, betaTesters: ['user_1'] } });

      expect(Object.keys(addon.provider)).not.toContain('betaTesters');
    });
  });
});
