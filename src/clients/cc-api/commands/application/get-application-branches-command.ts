import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetApplicationBranchesCommandInput,
  GetApplicationBranchesCommandOutput,
} from './get-application-branches-command.types.ts';

/**
 * Lists the branches available on an application's deployment repository.
 *
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

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
