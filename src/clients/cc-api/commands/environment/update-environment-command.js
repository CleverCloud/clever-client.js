/**
 * @import { UpdateEnvironmentCommandInput, UpdateEnvironmentCommandOutput } from './update-environment-command.types.js'
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { toNameValueObject } from '../../../../utils/environment-utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 * @extends {CcApiSimpleCommand<UpdateEnvironmentCommandInput, UpdateEnvironmentCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/env
 * @group Environment
 * @version 2
 */
export class UpdateEnvironmentCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateEnvironmentCommandInput, UpdateEnvironmentCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env`,
      toNameValueObject(params.environment),
    );
  }

  /** @type {CcApiSimpleCommand<UpdateEnvironmentCommandInput, UpdateEnvironmentCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.env, 'name');
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
