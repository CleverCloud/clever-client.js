/**
 * @import { GetInstanceCommandInput } from './get-instance-command.types.js'
 * @import { GetInstanceCommandOutput } from './get-instance-command.types.js'
 */
import { get } from '../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../lib/cc-api-command.js';

/**
 * @extends {CcApiSimpleCommand<GetInstanceCommandInput, GetInstanceCommandOutput>}
 */
export class GetInstanceCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetInstanceCommandInput, GetInstanceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances/${params.instanceId}`,
    );
  }

  /** @type {CcApiSimpleCommand<?, ?>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
