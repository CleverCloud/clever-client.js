/**
 * @import { CreateAddonProviderCommandInput, CreateAddonProviderCommandOutput } from './create-addon-provider-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddonProviderFull } from './addon-provider-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateAddonProviderCommandInput, CreateAddonProviderCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/addonproviders
 * @group AddonProvider
 * @version 2
 */
export class CreateAddonProviderCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateAddonProviderCommandInput, CreateAddonProviderCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const body = {
      id: params.id,
      name: params.name,
      api: {
        // eslint-disable-next-line camelcase
        config_vars: params.api.configVars,
        regions: params.api.zones,
        password: params.api.password,
        // eslint-disable-next-line camelcase
        sso_salt: params.api.ssoSalt,
        production: {
          // eslint-disable-next-line camelcase
          base_url: params.api.production.baseUrl,
          // eslint-disable-next-line camelcase
          sso_url: params.api.production.ssoUrl,
        },
        test: {
          // eslint-disable-next-line camelcase
          base_url: params.api.test.baseUrl,
          // eslint-disable-next-line camelcase
          sso_url: params.api.test.ssoUrl,
        },
      },
    };

    return post(safeUrl`/v2/organisations/${params.ownerId}/addonproviders`, body);
  }

  /** @type {CcApiSimpleCommand<CreateAddonProviderCommandInput, CreateAddonProviderCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformAddonProviderFull(response);
  }
}
