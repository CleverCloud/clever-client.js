import type { AddonProviderFull } from './addon-provider.types.js';

/**
 * Description of the add-on provider to register.
 */
export interface CreateAddonProviderCommandInput {
  /** Identifier of the organisation that will own the provider. */
  ownerId: string;
  /** Identifier to give to the provider, for example `my-service-addon`. Must be unique. */
  id: string;
  /** Display name of the provider. */
  name: string;
  /** How Clever Cloud reaches the provider to provision, update and sign into add-ons. */
  api: {
    /**
     * Names of the environment variables the provider exposes to linked applications. They must all be prefixed with
     * the upper-cased provider id.
     * @renamedFrom `config_vars`
     */
    configVars: Array<string>;
    /**
     * Names of the zones the provider can provision add-ons in.
     * @renamedFrom `regions`
     */
    zones: Array<string>;
    /** Password Clever Cloud authenticates with when calling the provisioning API. */
    password: string;
    /**
     * Secret used to sign the single sign-on payloads handed to the provider.
     * @renamedFrom `sso_salt`
     */
    ssoSalt: string;
    /** Endpoints used for providers in `RELEASE` status. */
    production: {
      /**
       * Base URL of the provisioning API.
       * @renamedFrom `base_url`
       */
      baseUrl: string;
      /**
       * URL the single sign-on payload is posted to.
       * @renamedFrom `sso_url`
       */
      ssoUrl: string;
    };
    /** Endpoints used while the provider is still in `ALPHA` status. */
    test: {
      /**
       * Base URL of the provisioning API.
       * @renamedFrom `base_url`
       */
      baseUrl: string;
      /**
       * URL the single sign-on payload is posted to.
       * @renamedFrom `sso_url`
       */
      ssoUrl: string;
    };
  };
}

/**
 * The freshly registered provider, with its still empty plan and feature catalogue.
 */
export type CreateAddonProviderCommandOutput = AddonProviderFull;
