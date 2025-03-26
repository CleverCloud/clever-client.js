import { get } from '../../common/lib/request/request-params-builder.js';
import { CcApiSimpleWithAutoOwnerCommand } from '../common/cc-api-commands.js';

/**
 * @typedef {import('./get-instance-command.types.js').GetInstanceCommandInput} GetInstanceCommandInput
 * @typedef {import('../../common/types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * // description ...
 *
 * @extends {CcApiSimpleWithAutoOwnerCommand<GetInstanceCommandInput, {instanceId: string}>}
 */
export class GetInstanceCommand extends CcApiSimpleWithAutoOwnerCommand {
  /**
   * @param {GetInstanceCommandInput} params
   */
  constructor(params) {
    super(params);
  }

  /**
   * @param {import('../types/cc-api.types.js').WithOwnerId<GetInstanceCommandInput>} params
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParamsWithOwnerId(params) {
    return get(
      `/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances/${params.instanceId}`,
    );
  }

  /**
   * @param {number} status
   * @returns {boolean}
   */
  isEmptyResponse(status) {
    return status === 404;
  }
}
