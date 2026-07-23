import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { ListTagCommandInput, ListTagCommandOutput } from './list-tag-command.types.js';

/**
 * Lists the tags attached to an application or an add-on.
 *
 * The resource kind is picked from the input: passing an `applicationId` targets an application,
 * passing an `addonId` targets an add-on.
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/tags
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/tags
 * @group Tag
 * @version 2
 */
export class ListTagCommand extends CcApiSimpleCommand<ListTagCommandInput, ListTagCommandOutput> {
  toRequestParams(params: ListTagCommandInput) {
    if ('applicationId' in params) {
      return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tags`);
    }
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/tags`);
  }

  transformCommandOutput(response: unknown): ListTagCommandOutput {
    return (response as ListTagCommandOutput)?.sort() ?? [];
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
