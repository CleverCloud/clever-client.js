import { delete_ } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { DeleteTagCommandInput, DeleteTagCommandOutput } from './delete-tag-command.types.ts';

/**
 * Removes one tag from an application or an add-on.
 *
 * The resource kind is picked from the input: passing an `applicationId` targets an application,
 * passing an `addonId` targets an add-on.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/tags/:XXX
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

  isIdempotent(): boolean {
    return true;
  }
}
