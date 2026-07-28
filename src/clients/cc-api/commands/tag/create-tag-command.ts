import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { CreateTagCommandInput, CreateTagCommandOutput } from './create-tag-command.types.js';

/**
 * Adds one tag to an application or an add-on.
 *
 * The resource kind is picked from the input: passing an `applicationId` targets an application,
 * passing an `addonId` targets an add-on.
 *
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/tags/:XXX
 * @endpoint [PUT] /v2/organisations/:XXX/addons/:XXX/tags
 * @group Tag
 * @version 2
 */
export class CreateTagCommand extends CcApiSimpleCommand<CreateTagCommandInput, CreateTagCommandOutput> {
  toRequestParams(params: CreateTagCommandInput) {
    if ('applicationId' in params) {
      return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tags/${params.tag}`);
    }
    return put(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/tags/${params.tag}`);
  }

  transformCommandOutput(response: unknown): CreateTagCommandOutput {
    return (response as CreateTagCommandOutput).sort();
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }

  // a tag is stored keyed on the resource and the tag itself, so re-adding one already there stores nothing more
  isIdempotent(): boolean {
    return true;
  }
}
