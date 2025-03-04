import { AbstractCommand } from './abstract-command.js';
import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * @typedef {import('../request/request.types.js').RequestParams} RequestParams
 */

/**
 * @extends {AbstractCommand<{instanceId: string}>}
 */
export class AddEmailAddressCommand extends AbstractCommand {
  /**
   * @param {object} params
   * @param {string} params.emailAddress
   * @param {string} params.makePrimary
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
      method: 'PUT',
      url: `/v2/self/emails/${this.params.emailAddress}`,
      headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
      body: {
        make_primary: this.params.makePrimary,
      },
    };
  }
}
