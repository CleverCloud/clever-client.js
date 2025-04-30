/**
 * @import { GetExposedEnvironmentCommandInput, GetExposedEnvironmentCommandOutput } from './get-exposed-environment-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { toArray } from '../../../../utils/environment-utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetExposedEnvironmentCommandInput, GetExposedEnvironmentCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/exposed_env
 * @group Environment
 * @version 2
 */
export class GetExposedEnvironmentCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetExposedEnvironmentCommandInput, GetExposedEnvironmentCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/exposed_env`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetExposedEnvironmentCommandInput, GetExposedEnvironmentCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(toArray(response), 'name');
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
