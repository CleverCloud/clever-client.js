import { postJson, put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  AddApplicationToAddonLinkCommandInput,
  AddApplicationToApplicationLinkCommandInput,
  AddLinkCommandInput,
} from './add-link-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/dependencies/:XXX
 * @endpoint [POST] /v2/organisations/:XXX/applications/:XXX/addons
 * @group Link
 * @version 2
 */
export class AddLinkCommand extends CcApiCompositeCommand<AddLinkCommandInput, undefined> {
  async compose(params: AddLinkCommandInput, composer: CcApiComposer): Promise<undefined> {
    if ('targetApplicationId' in params) {
      await composer.send(new AddApplicationToApplicationLinkCommand(params));
    } else {
      await composer.send(new AddApplicationToAddonLinkCommand(params));
    }

    return undefined;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}

/**
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/dependencies/:XXX
 * @group Link
 * @version 2
 */
export class AddApplicationToApplicationLinkCommand extends CcApiSimpleCommand<
  AddApplicationToApplicationLinkCommandInput,
  undefined
> {
  toRequestParams(params: AddApplicationToApplicationLinkCommandInput) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/dependencies/${params.targetApplicationId}`,
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}

/**
 * @endpoint [POST] /v2/organisations/:XXX/applications/:XXX/addons
 * @group Link
 * @version 2
 */
export class AddApplicationToAddonLinkCommand extends CcApiSimpleCommand<
  AddApplicationToAddonLinkCommandInput,
  undefined
> {
  toRequestParams(params: AddApplicationToAddonLinkCommandInput) {
    return postJson(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/addons`,
      params.targetAddonId,
    );
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: { property: 'targetAddonId', type: 'ADDON_ID' },
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
