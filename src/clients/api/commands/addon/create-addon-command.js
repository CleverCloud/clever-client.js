/**
 * @import { CreateAddonCommandInput, CreateAddonCommandOutput } from './create-addon-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformAddon } from './addon-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateAddonCommandInput, CreateAddonCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/addons
 * @group Addon
 * @version 2
 */
export class CreateAddonCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateAddonCommandInput, CreateAddonCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    const body = {
      ...omit(params, 'ownerId', 'planId'),
      plan: params.planId,
      options: params.options ?? {},
    };

    return post(safeUrl`/v2/organisations/${params.ownerId}/addons`, body);
  }

  /** @type {CcApiSimpleCommand<CreateAddonCommandInput, CreateAddonCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformAddon(response);
  }
}
