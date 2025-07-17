/**
 * @import { AddLinkCommandInput, AddApplicationToApplicationLinkCommandInput, AddApplicationToAddonLinkCommandInput } from './add-link-command.types.js';
 */
import { postJson, put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<AddLinkCommandInput, void>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/dependencies/:XXX
 * @endpoint [POST] /v2/organisations/:XXX/applications/:XXX/addons
 * @group Link
 * @version 2
 */
export class AddLinkCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<AddLinkCommandInput, void>['compose']} */
  async compose(params, composer) {
    if ('targetApplicationId' in params) {
      await composer.send(new AddApplicationToApplicationLinkCommand(params));
    } else {
      await composer.send(new AddApplicationToAddonLinkCommand(params));
    }

    return null;
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
 * @extends {CcApiSimpleCommand<AddApplicationToApplicationLinkCommandInput, void>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/dependencies/:XXX
 * @group Link
 * @version 2
 */
export class AddApplicationToApplicationLinkCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<AddApplicationToApplicationLinkCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/dependencies/${params.targetApplicationId}`,
    );
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<AddApplicationToAddonLinkCommandInput, void>}
 * @endpoint [POST] /v2/organisations/:XXX/applications/:XXX/addons
 * @group Link
 * @version 2
 */
export class AddApplicationToAddonLinkCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<AddApplicationToAddonLinkCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return postJson(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/addons`,
      params.targetAddonId,
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: { property: 'targetAddonId', type: 'ADDON_ID' },
    };
  }
}
