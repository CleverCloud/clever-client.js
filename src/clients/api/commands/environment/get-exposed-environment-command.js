/**
 * @import { GetExposedEnvironmentCommandInput, GetExposedEnvironmentCommandOutput } from './get-exposed-environment-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
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

  /** @type {CcApiSimpleCommand<GetExposedEnvironmentCommandInput, GetExposedEnvironmentCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<GetExposedEnvironmentCommandInput, GetExposedEnvironmentCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return Object.entries(response).map(([name, value]) => ({ name, value }));
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
