import type { AddonProviderFull } from './addon-provider.types.js';

export interface CreateAddonProviderCommandInput {
  ownerId: string;
  id: string;
  name: string;
  api: {
    // renamed from config_vars
    configVars: Array<string>;
    // renamed from regions
    zones: Array<string>;
    password: string;
    // renamed from sso_salt
    ssoSalt: string;
    production: {
      // renamed from base_url
      baseUrl: string;
      // renamed from sso_url
      ssoUrl: string;
    };
    test: {
      // renamed from base_url
      baseUrl: string;
      // renamed from sso_url
      ssoUrl: string;
    };
  };
}

export type CreateAddonProviderCommandOutput = AddonProviderFull;
