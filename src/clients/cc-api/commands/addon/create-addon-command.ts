import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddon } from './addon-transform.js';
import type { CreateAddonCommandInput, CreateAddonCommandOutput } from './create-addon-command.types.js';

/**
 * @endpoint [POST] /v2/organisations/:XXX/addons
 * @group Addon
 * @version 2
 */
export class CreateAddonCommand extends CcApiSimpleCommand<CreateAddonCommandInput, CreateAddonCommandOutput> {
  toRequestParams(params: CreateAddonCommandInput) {
    return post(safeUrl`/v2/organisations/${params.ownerId}/addons`, {
      name: params.name,
      providerId: params.providerId,
      region: params.zone,
      plan: params.planId,
      options: params.options ?? {},
    });
  }

  transformCommandOutput(response: unknown): CreateAddonCommandOutput {
    return transformAddon(response);
  }
}
