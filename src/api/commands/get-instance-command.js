import { AbstractCommand } from '../../lib/command/abstract-command.js';
import { get } from '../../lib/request/request-params-builder.js';

/**
 * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * // description ...
 *
 * @extends {AbstractCommand<{instanceId: string}>}
 */
export class GetInstanceCommand extends AbstractCommand {
  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.applicationId
   * @param {string} params.instanceId
   */
  constructor(params) {
    super();
    this.params = params;
  }

  /**
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams() {
    return get(
      `/v4/orchestration/organisations/${this.params.ownerId}/applications/${this.params.applicationId}/instances/${this.params.instanceId}`,
    );
  }

  is404Success() {
    return true;
  }
}
