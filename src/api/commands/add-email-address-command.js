import { put } from '../../lib/request/request-params-builder.js';
import { AbstractApiCommand } from './abstract-api-command.js';

/**
 * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @extends {AbstractApiCommand<{instanceId: string}>}
 */
export class AddEmailAddressCommand extends AbstractApiCommand {
  /**
   * @param {object} params
   * @param {string} params.emailAddress
   * @param {string} params.makePrimary
   */
  constructor(params) {
    super();
    this.params = params;
  }

  /**
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams() {
    return put(`/v2/self/emails/${this.params.emailAddress}`, {
      // eslint-disable-next-line camelcase
      make_primary: this.params.makePrimary,
    });
  }
}
