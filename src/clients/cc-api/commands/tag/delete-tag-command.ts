import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { DeleteTagCommandInput, DeleteTagCommandOutput } from './delete-tag-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/addons/:XXX/tags/:XXX
 * @group Tag
 * @version 2
 */
export class DeleteTagCommand extends CcApiSimpleCommand<DeleteTagCommandInput, DeleteTagCommandOutput> {
  toRequestParams(params: DeleteTagCommandInput) {
    if ('applicationId' in params) {
      return delete_(
        safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/tags/${params.tag}`,
      );
    }
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/tags/${params.tag}`);
  }

  transformCommandOutput(response: unknown): DeleteTagCommandOutput {
    return (response as DeleteTagCommandOutput).sort();
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
