/**
 * @import { UpdateApplicationCommandInput, UpdateApplicationCommandOutput, UpdateApplicationBranchCommandInput } from './update-application-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformApplication } from './application-transform.js';

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

    return composer.send(new UpdateApplicationInternalCommand(params));
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
class UpdateApplicationInternalCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UpdateApplicationCommandInput, UpdateApplicationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    /** @type {any} */
    const body = {
      ...omit(params, 'ownerId', 'applicationId'),
    };
    if (params.forceHttps != null) {
      body.forceHttps = params.forceHttps ? 'ENABLED' : 'DISABLED';
    }

    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}`, body);
  }

  /** @type {CcApiSimpleCommand<UpdateApplicationCommandInput, UpdateApplicationCommandOutput>['transformCommandOutput']} */
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

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
