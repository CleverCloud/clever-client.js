import { toNameValueObject } from '../../../esm/utils/env-vars.js';
import { put } from '../../common/lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../common/cc-api-commands.js';

/**
 * @api GET /v2/self/applications/${XXX}/env
 * @operationId ...
 * @api GET /v2/organisations/${XXX}/applications/${XXX}/env
 * @operationId ...
 *
 * @extends {CcApiSimpleCommand<import('./update-all-env-vars-command.types.js').UpdateAllEnvVarsCommandResponse>}
 */
export class UpdateAllEnvVarsCommand extends CcApiSimpleCommand {
  /**
   * @param {object} params
   * @param {string} [params.ownerId]
   * @param {string} params.applicationId
   * @param {Array<{name: string, value: string}>} params.envVars
   */
  constructor(params) {
    super();
    this.params = params;
  }

  toRequestParams() {
    const urlBase = this.params.ownerId == null ? '/self' : `/organisations/${this.params.ownerId}`;
    return put(`/v2${urlBase}/applications/${this.params.applicationId}/env`, toNameValueObject(this.params.envVars));
  }
}
