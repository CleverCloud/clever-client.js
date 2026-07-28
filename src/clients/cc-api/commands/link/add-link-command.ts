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
 * Links an application to another application or to an add-on.
 *
 * The target kind is picked from the input. Once linked, the target's configuration is injected
 * into the application's environment on its next deployment.
 *
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

  // both endpoints refuse to link a target twice, so a replay leaves a single link
  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Links an application to another application.
 *
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

  // an existing dependency is refused as a duplicate, so a replay does not link the application twice
  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Links an application to an add-on.
 *
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

  // the add-on is only attached when it is not linked yet, so a replay changes nothing
  isIdempotent(): boolean {
    return true;
  }
}
