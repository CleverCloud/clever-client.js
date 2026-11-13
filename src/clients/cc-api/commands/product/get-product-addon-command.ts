import { QueryParams } from '../../../../lib/request/query-params.ts';
import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import { transformAddonProviderFull } from '../addon-provider/addon-provider-transform.ts';
import type { GetProductAddonCommandInput, GetProductAddonCommandOutput } from './get-product-addon-command.types.ts';
import { GetProductAddonVersionsCommand } from './get-product-addon-versions-command.ts';

/**
 * Retrieves one add-on provider from the product catalogue, optionally with the versions it offers.
 *
 * Passing an owner narrows the plans and prices down to what that organisation is entitled to.
 *
 * @endpoint [GET] /v2/products/addonproviders/:XXX
 * @endpoint [GET] /v4/addon-providers/:XXX
 * @group Product
 * @version 2
 */
export class GetProductAddonCommand extends CcApiCompositeCommand<
  GetProductAddonCommandInput,
  GetProductAddonCommandOutput
> {
  async compose(params: GetProductAddonCommandInput, composer: CcApiComposer): Promise<GetProductAddonCommandOutput> {
    const addon = await composer.send(new GetProductAddonInnerCommand(params));

    if (!params.withVersions) {
      return addon;
    }

    const versions = await composer.send(new GetProductAddonVersionsCommand(params));
    return {
      ...addon,
      versions,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Retrieves one add-on provider, without its versions.
 *
 * @endpoint [GET] /v2/products/addonproviders/:XXX
 * @group Product
 * @version 2
 */
class GetProductAddonInnerCommand extends CcApiSimpleCommand<
  GetProductAddonCommandInput,
  GetProductAddonCommandOutput
> {
  toRequestParams(params: GetProductAddonCommandInput) {
    return get(safeUrl`/v2/products/addonproviders/${params.id}`, new QueryParams().append('orgaId', params.ownerId));
  }

  transformCommandOutput(response: unknown): GetProductAddonCommandOutput {
    return transformAddonProviderFull(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
