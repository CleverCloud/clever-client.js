/**
 * @import { UpdateExposedEnvironmentCommandInput } from './update-exposed-environment-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { toNameValueObject } from '../../../../utils/environment-utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UpdateExposedEnvironmentCommandInput, void>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/exposed_env
 * @group Environment
 * @version 2
 */
export class UpdateExposedEnvironmentCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateExposedEnvironmentCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/exposed_env`,
      toNameValueObject(params.environment),
    );
  }

  /** @type {CcApiSimpleCommand<UpdateExposedEnvironmentCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput(_response) {
    return null;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
