/**
 * @import { GetApplicationCommandInput, GetApplicationCommandOutput } from './get-application-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformApplication } from './application-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetApplicationCommandInput, GetApplicationCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX
 * @group Application
 * @version 2
 */
export class GetApplicationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetApplicationCommandInput, GetApplicationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}`);
  }

  /** @type {CcApiSimpleCommand<GetApplicationCommandInput, GetApplicationCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }

  /** @type {CcApiSimpleCommand<GetApplicationCommandInput, GetApplicationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformApplication(response);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
