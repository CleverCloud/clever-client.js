/**
 * @import { GetApplicationBranchesCommandInput, GetApplicationBranchesCommandOutput } from './get-application-branches-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetApplicationBranchesCommandInput, GetApplicationBranchesCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/branches
 * @group Application
 * @version 2
 */
export class GetApplicationBranchesCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetApplicationBranchesCommandInput, GetApplicationBranchesCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/branches`);
  }

  /** @type {CcApiSimpleCommand<GetApplicationBranchesCommandInput, GetApplicationBranchesCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.sort();
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
