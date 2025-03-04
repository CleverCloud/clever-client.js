import { AbstractCommand } from './abstract-command.js';
import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * @typedef {import('../request/request.types.js').RequestParams} RequestParams
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
  constructor (params) {
    super();
    this.params = params;
  }

  /**
   * @returns {Partial<RequestParams>}
   */
  toRequestParams () {
    return {
      method: 'get',
      url: `/v4/orchestration/organisations/${this.params.ownerId}/applications/${this.params.applicationId}/instances/${this.params.instanceId}`,
      headers: new HeadersBuilder().acceptJson().build(),
    };
  }
}
