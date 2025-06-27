/**
 * @import { DeleteEnvironmentVariableCommandInput, DeleteEnvironmentVariableCommandOutput } from './delete-environment-variable-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeleteEnvironmentVariableCommandInput, DeleteEnvironmentVariableCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/env/:XXX
 * @group Environment
 * @version 2
 */
export class DeleteEnvironmentVariableCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeleteEnvironmentVariableCommandInput, DeleteEnvironmentVariableCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env/${params.name}`,
    );
  }

  /** @type {CcApiSimpleCommand<DeleteEnvironmentVariableCommandInput, DeleteEnvironmentVariableCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return response.env;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
