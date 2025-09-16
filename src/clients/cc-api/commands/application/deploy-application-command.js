/**
 * @import { DeployApplicationCommandInput, DeployApplicationCommandOutput } from './deploy-application-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeployApplicationCommandInput, DeployApplicationCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/applications/:XXX/instances
 * @group Application
 * @version 2
 */
export class DeployApplicationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeployApplicationCommandInput, DeployApplicationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/instances`,
      null,
      new QueryParams({
        commit: params.commit,
        useCache: params.useCache === false ? 'no' : null,
      }),
    );
  }

  /** @type {CcApiSimpleCommand<DeployApplicationCommandInput, DeployApplicationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      deploymentId: response.deploymentId,
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
