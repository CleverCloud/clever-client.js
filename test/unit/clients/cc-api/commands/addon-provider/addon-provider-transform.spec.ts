import { describe, expect, it } from 'vitest';
import { transformAddonProviderFull } from '../../../../../../src/clients/cc-api/commands/addon-provider/addon-provider-transform.js';
import { ListAddonProviderPlanCommand } from '../../../../../../src/clients/cc-api/commands/addon-provider/list-addon-provider-plan-command.js';

/** Two plans sharing a price, in neither of the two orders the sort can produce. */
function getPlanPayloads() {
  return [
    {
      id: 'plan_3',
      name: 'XL Medium Space',
      slug: 'xl_med',
      price: 400,
      price_id: 'PG_XL_MED',
      features: [],
      zones: [],
    },
    { id: 'plan_1', name: 'XS Small Space', slug: 'xs_sml', price: 15, price_id: 'PG_XS_SML', features: [], zones: [] },
    { id: 'plan_2', name: 'L Giant Space', slug: 'l_gnt', price: 400, price_id: 'PG_L_GNT', features: [], zones: [] },
  ];
}

/** A payload as `AddonProviderInfoFullView` serialises it. */
function getAddonProviderFullPayload() {
  return {
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
    regions: ['par'],
    plans: getPlanPayloads(),
    features: [],
  };
}

describe('addon-provider-transform', () => {
  describe('transformAddonProviderFull', () => {
    it('should sort the plans by price then by name', () => {
      const provider = transformAddonProviderFull(getAddonProviderFullPayload());

      expect(provider.plans.map((plan) => plan.id)).toEqual(['plan_1', 'plan_2', 'plan_3']);
    });

    // the same plans reach a caller through the provider and through the listing
    it('should sort the plans the way ListAddonProviderPlanCommand does', () => {
      const provider = transformAddonProviderFull(getAddonProviderFullPayload());
      const listed = new ListAddonProviderPlanCommand({ addonProviderId: 'postgresql-addon' }).transformCommandOutput(
        getPlanPayloads(),
      );

      expect(provider.plans).toEqual(listed);
    });
  });
});
