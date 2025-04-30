/**
 * @import { GetApplicationInstanceCommandInput, GetApplicationInstanceCommandOutput } from './get-application-instance-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformApplicationInstance } from './instance-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetApplicationInstanceCommandInput, GetApplicationInstanceCommandOutput>}
 * @endpoint [GET] /v4/orchestration/organisations/:XXX/applications/:XXX/instances/:XXX
 * @group Instance
 * @version 4
 */
export class GetApplicationInstanceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetApplicationInstanceCommandInput, GetApplicationInstanceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances/${params.instanceId}`,
    );
  }

  /** @type {CcApiSimpleCommand<GetApplicationInstanceCommandInput, GetApplicationInstanceCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformApplicationInstance(response);
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
