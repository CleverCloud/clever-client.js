import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { UpdateTagCommandInput, UpdateTagCommandOutput } from './update-tag-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/addons/:XXX/tags
 * @group Tag
 * @version 2
 */
export class UpdateTagCommand extends CcApiSimpleCommand<UpdateTagCommandInput, UpdateTagCommandOutput> {
  toRequestParams(params: UpdateTagCommandInput) {
    if ('applicationId' in params) {
      return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tags`, params.tags);
    }
    return put(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/tags`, params.tags);
  }

  transformCommandOutput(response: unknown): UpdateTagCommandOutput {
    return (response as UpdateTagCommandOutput)?.sort() ?? [];
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
