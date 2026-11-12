import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformAddonSso } from './addon-transform.ts';
import type { GetAddonSsoCommandInput, GetAddonSsoCommandOutput } from './get-addon-sso-command.types.ts';

/**
 * Retrieves the single sign-on payload that logs the current user into the provider's own console.
 *
 * The payload is meant to be posted to the provider SSO URL: it carries a short-lived, signed proof
 * that the caller owns the add-on.
 *
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/sso
 * @group Addon
 * @version 2
 */
export class GetAddonSsoCommand extends CcApiSimpleCommand<GetAddonSsoCommandInput, GetAddonSsoCommandOutput> {
  toRequestParams(params: GetAddonSsoCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/sso`);
  }

  transformCommandOutput(response: unknown): GetAddonSsoCommandOutput {
    return transformAddonSso(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }

  // the payload is signed on the fly from the add-on and the provider salt, nothing is stored or
  // rotated
  isIdempotent(): boolean {
    return true;
  }
}
