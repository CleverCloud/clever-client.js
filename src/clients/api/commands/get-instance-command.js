import { get } from '../../../lib/request/request-params-builder.js';
import { CcApiSimpleWithOwnerCommand } from '../lib/cc-api-command.js';

/**
 * @typedef {import('./get-instance-command.types.js').GetInstanceCommandInput} GetInstanceCommandInput
 * @typedef {import('./get-instance-command.types.js').GetInstanceCommandOutput} GetInstanceCommandOutput
 */

/**
 * @extends {CcApiSimpleWithOwnerCommand<GetInstanceCommandInput, GetInstanceCommandOutput>}
 */
export class GetInstanceCommand extends CcApiSimpleWithOwnerCommand {
  /** @type {CcApiSimpleWithOwnerCommand<GetInstanceCommandInput, GetInstanceCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances/${params.instanceId}`,
    );
  }

  /** @type {CcApiSimpleWithOwnerCommand<?, ?>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
