/**
 * @import { GetInstanceCommandInput, GetInstanceCommandOutput } from './get-instance-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetInstanceCommandInput, GetInstanceCommandOutput>}
 * @endpoint [GET] /v4/orchestration/organisations/:XXX/applications/:XXX/instances/:XXX
 * @group Instance
 * @version 4
 */
export class GetInstanceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetInstanceCommandInput, GetInstanceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances/${params.instanceId}`,
    );
  }

  /** @type {CcApiSimpleCommand<GetInstanceCommandInput, GetInstanceCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
