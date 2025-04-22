import { toNameValueObject } from '../../../../../esm/utils/env-vars.js';
import { put } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleWithOwnerCommand } from '../../lib/cc-api-command.js';

/**
 * @typedef {import('./update-env-command.types.js').UpdateAllEnvVarsCommandInput} UpdateAllEnvVarsCommandInput
 * @typedef {import('./update-env-command.types.js').UpdateAllEnvVarsCommandOutput} UpdateAllEnvVarsCommandOutput
 */

/**
 * @extends {CcApiSimpleWithOwnerCommand<UpdateAllEnvVarsCommandInput, UpdateAllEnvVarsCommandOutput>}
 */
export class UpdateEnvCommand extends CcApiSimpleWithOwnerCommand {
  /** @type {CcApiSimpleWithOwnerCommand<UpdateAllEnvVarsCommandInput, UpdateAllEnvVarsCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      `/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env`,
      toNameValueObject(params.environment),
    );
  }
}
