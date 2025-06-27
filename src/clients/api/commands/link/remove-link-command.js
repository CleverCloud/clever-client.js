/**
 * @import { RemoveLinkCommandInput, RemoveApplicationToApplicationLinkCommandInput, RemoveApplicationToAddonLinkCommandInput } from './remove-link-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<RemoveLinkCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/dependencies/:XXX
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/addons/:XXX
 * @group Link
 * @version 2
 */
export class RemoveLinkCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<RemoveLinkCommandInput, void>['compose']} */
  async compose(params, composer) {
    if ('targetApplicationId' in params) {
      return composer.send(new RemoveApplicationToApplicationLinkCommand(params));
    }
    return composer.send(new RemoveApplicationToAddonLinkCommand(params));
  }

  /** @type {CcApiCompositeCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<RemoveApplicationToApplicationLinkCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/dependencies/:XXX
 * @group Link
 * @version 2
 */
export class RemoveApplicationToApplicationLinkCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RemoveApplicationToApplicationLinkCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/dependencies/${params.targetApplicationId}`,
    );
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<RemoveApplicationToAddonLinkCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/addons/:XXX
 * @group Link
 * @version 2
 */
export class RemoveApplicationToAddonLinkCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<RemoveApplicationToAddonLinkCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/addons/${params.targetAddonId}`,
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: { property: 'targetAddonId', type: 'ADDON_ID' },
    };
  }
}
