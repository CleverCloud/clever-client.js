import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProviderFull } from './addon-provider-transform.js';
import type {
  CreateAddonProviderCommandInput,
  CreateAddonProviderCommandOutput,
} from './create-addon-provider-command.types.js';

/**
 * Registers a new add-on provider owned by an organisation.
 *
 * This is the entry point for partners publishing a service on the marketplace: it declares the
 * provisioning API Clever Cloud will call, and the credentials used to talk to it. The provider
 * starts with no plan and no feature.
 *
 * @endpoint [POST] /v2/organisations/:XXX/addonproviders
 * @group AddonProvider
 * @version 2
 */
export class CreateAddonProviderCommand extends CcApiSimpleCommand<
  CreateAddonProviderCommandInput,
  CreateAddonProviderCommandOutput
> {
  toRequestParams(params: CreateAddonProviderCommandInput) {
    const body = {
      id: params.id,
      name: params.name,
      api: {
        config_vars: params.api.configVars,
        regions: params.api.zones,
        password: params.api.password,

        sso_salt: params.api.ssoSalt,
        production: {
          base_url: params.api.production.baseUrl,

          sso_url: params.api.production.ssoUrl,
        },
        test: {
          base_url: params.api.test.baseUrl,

          sso_url: params.api.test.ssoUrl,
        },
      },
    };

    return post(safeUrl`/v2/organisations/${params.ownerId}/addonproviders`, body);
  }

  transformCommandOutput(response: unknown): CreateAddonProviderCommandOutput {
    return transformAddonProviderFull(response);
  }

  // the provider id comes from the caller and is looked up first, so a replay is refused rather than
  // registering a second provider
  isIdempotent(): boolean {
    return true;
  }
}
