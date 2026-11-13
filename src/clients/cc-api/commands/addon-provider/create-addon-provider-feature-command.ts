import { post } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformAddonProviderFeature } from './addon-provider-transform.ts';
import type {
  CreateAddonProviderFeatureCommandInput,
  CreateAddonProviderFeatureCommandOutput,
} from './create-addon-provider-feature-command.types.ts';

/**
 * Adds a feature to an add-on provider's catalogue.
 *
 * Features are declared once on the provider, then given a value by each plan.
 *
 * @endpoint [POST] /v2/organisations/:XXX/addonproviders/:XXX/features
 * @group AddonProvider
 * @version 2
 */
export class CreateAddonProviderFeatureCommand extends CcApiSimpleCommand<
  CreateAddonProviderFeatureCommandInput,
  CreateAddonProviderFeatureCommandOutput
> {
  toRequestParams(params: CreateAddonProviderFeatureCommandInput) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/addonproviders/${params.addonProviderId}/features`, {
      name: params.name,
      type: params.type,
    });
  }

  transformCommandOutput(response: unknown): CreateAddonProviderFeatureCommandOutput {
    return transformAddonProviderFeature(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  // the feature name is checked against the ones already declared, so a replay is refused rather than
  // adding the feature twice
  isIdempotent(): boolean {
    return true;
  }
}
