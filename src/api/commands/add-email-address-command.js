import { put } from '../../common/lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../common/cc-api-commands.js';

/**
 * @typedef {import('../../common/types/request.types.js').CcRequestParams} CcRequestParams
 */

/**
 * @extends {CcApiSimpleCommand<{instanceId: string}>}
 */
export class AddEmailAddressCommand extends CcApiSimpleCommand {
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
