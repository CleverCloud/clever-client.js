/**
 * @import { CreateOrUpdateEnvironmentVariableCommandInput, CreateOrUpdateEnvironmentVariableCommandOutput } from './create-or-update-environment-variable-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateOrUpdateEnvironmentVariableCommandInput, CreateOrUpdateEnvironmentVariableCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/env/:XXX
 * @group Environment
 * @version 2
 */
export class CreateOrUpdateEnvironmentVariableCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateOrUpdateEnvironmentVariableCommandInput, CreateOrUpdateEnvironmentVariableCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env/${params.name}`, {
      value: params.value,
    });
  }

  /** @type {CcApiSimpleCommand<CreateOrUpdateEnvironmentVariableCommandInput, CreateOrUpdateEnvironmentVariableCommandOutput>['transformCommandOutput']} */
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
