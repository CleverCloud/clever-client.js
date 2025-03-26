import { get } from '../../common/lib/request/request-params-builder.js';
import { CcApiSimpleWithAutoOwnerCommand } from '../common/cc-api-commands.js';

/**
 * @typedef {import('../../common/types/request.types.js').CcRequestParams} CcRequestParams
 * @typedef {import('./get-instance-command.types.js').GetInstanceCommandInput} GetInstanceCommandInput
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
   * @param {string} ownerId
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParamsWithOwnerId(ownerId) {
    return get(
      `/v4/orchestration/organisations/${ownerId}/applications/${this.params.applicationId}/instances/${this.params.instanceId}`,
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
