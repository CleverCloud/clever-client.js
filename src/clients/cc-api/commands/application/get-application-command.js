/**
 * @import { GetApplicationCommandInput, GetApplicationCommandOutput } from './get-application-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformApplication } from './application-transform.js';
import { consolidateApplicationWithBranches } from './application-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<GetApplicationCommandInput, GetApplicationCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/branches
 * @group Application
 * @version 2
 */
export class GetApplicationCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<GetApplicationCommandInput, GetApplicationCommandOutput>['compose']} */
  async compose(params, composer) {
    const application = await composer.send(new GetApplicationInnerCommand(params));

    if (application == null) {
      return null;
    }
    if (params.withBranches === true) {
      await consolidateApplicationWithBranches(application, composer);
    }
    return application;
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<GetApplicationCommandInput, GetApplicationCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX
 * @group Application
 * @version 2
 */
export class GetApplicationInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetApplicationCommandInput, GetApplicationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
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
