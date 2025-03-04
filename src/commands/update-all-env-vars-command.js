import { AbstractCommand } from './abstract-command.js';
import { HeadersBuilder } from '../request/headers-builder.js';
import { toNameValueObject } from '../../esm/utils/env-vars.js';

/**
 * @extends {AbstractCommand<import('./update-all-env-vars-command.types.js').UpdateAllEnvVarsCommandResponse>}
 */
export class UpdateAllEnvVarsCommand extends AbstractCommand {

  /**
   * @param {object} params
   * @param {string} [params.ownerId]
   * @param {string} params.applicationId
   * @param {Array<{name: string, value: string}>} params.envVars
   */
  constructor (params) {
    super();
    this.params = params;
  }

  toRequestParams () {
    const urlBase = this.params.ownerId == null ? '/self' : `/organisations/${this.params.ownerId}`;
    return {
      method: 'PUT',
      url: `/v2${urlBase}/applications/${this.params.applicationId}/env`,
      headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
      body: toNameValueObject(this.params.envVars),
    };
  }
}
