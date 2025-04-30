/**
 * @import { UpdateApplicationCommandInput, UpdateApplicationCommandOutput, UpdateApplicationBranchCommandInput } from './update-application-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { toNameValueObject } from '../../../../utils/environment-utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformApplication } from './application-transform.js';
import { consolidateApplicationWithBranches } from './application-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<UpdateApplicationCommandInput, UpdateApplicationCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX
 * @group Application
 * @version 2
 */
export class UpdateApplicationCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<UpdateApplicationCommandInput, UpdateApplicationCommandOutput>['compose']} */
  async compose(params, composer) {
    if (params.branch != null) {
      await composer.send(
        new UpdateApplicationBranchCommand({
          ownerId: params.ownerId,
          applicationId: params.applicationId,
          branch: params.branch,
        }),
      );
    }

    const application = await composer.send(new UpdateApplicationInnerCommand(params));
    await consolidateApplicationWithBranches(application, composer);
    return application;
  }

  /** @type {CcApiCompositeCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<UpdateApplicationCommandInput, UpdateApplicationCommandOutput>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX
 * @group Application
 * @version 2
 */
class UpdateApplicationInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateApplicationCommandInput, UpdateApplicationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    /** @type {any} */
    const body = {
      ...omit(params, 'ownerId', 'applicationId', 'environment'),
    };
    if (params.environment != null) {
      body.env = toNameValueObject(params.environment);
    }
    if (params.instanceLifetime != null) {
      body.instanceLifetime = params.instanceLifetime;
    }
    if (params.forceHttps != null) {
      body.forceHttps = params.forceHttps ? 'ENABLED' : 'DISABLED';
    }

    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}`, body);
  }

  /** @type {CcApiSimpleCommand<UpdateApplicationCommandInput, UpdateApplicationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformApplication(response);
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<UpdateApplicationBranchCommandInput, void>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/branch
 * @group Application
 * @version 2
 */
class UpdateApplicationBranchCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateApplicationBranchCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/branch`, {
      branch: params.branch,
    });
  }
}
