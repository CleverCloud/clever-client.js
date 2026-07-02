import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetApplicationBranchesCommandInput,
  GetApplicationBranchesCommandOutput,
} from './get-application-branches-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/branches
 * @group Application
 * @version 2
 */
export class GetApplicationBranchesCommand extends CcApiSimpleCommand<
  GetApplicationBranchesCommandInput,
  GetApplicationBranchesCommandOutput
> {
  toRequestParams(params: GetApplicationBranchesCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/branches`);
  }

  transformCommandOutput(response: unknown): GetApplicationBranchesCommandOutput {
    return (response as GetApplicationBranchesCommandOutput).sort();
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
