import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  RemoveApplicationToAddonLinkCommandInput,
  RemoveApplicationToApplicationLinkCommandInput,
  RemoveLinkCommandInput,
} from './remove-link-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/dependencies/:XXX
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/addons/:XXX
 * @group Link
 * @version 2
 */
export class RemoveLinkCommand extends CcApiCompositeCommand<RemoveLinkCommandInput, undefined> {
  async compose(params: RemoveLinkCommandInput, composer: CcApiComposer): Promise<undefined> {
    if ('targetApplicationId' in params) {
      return composer.send(new RemoveApplicationToApplicationLinkCommand(params));
    }
    return composer.send(new RemoveApplicationToAddonLinkCommand(params));
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/dependencies/:XXX
 * @group Link
 * @version 2
 */
export class RemoveApplicationToApplicationLinkCommand extends CcApiSimpleCommand<
  RemoveApplicationToApplicationLinkCommandInput,
  undefined
> {
  toRequestParams(params: RemoveApplicationToApplicationLinkCommandInput) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/dependencies/${params.targetApplicationId}`,
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/addons/:XXX
 * @group Link
 * @version 2
 */
export class RemoveApplicationToAddonLinkCommand extends CcApiSimpleCommand<
  RemoveApplicationToAddonLinkCommandInput,
  undefined
> {
  toRequestParams(params: RemoveApplicationToAddonLinkCommandInput) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/addons/${params.targetAddonId}`,
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
