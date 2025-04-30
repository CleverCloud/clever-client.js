/**
 * @import { UndeployApplicationCommandInput } from './undeploy-application-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UndeployApplicationCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/instances
 * @group Application
 * @version 2
 */
export class UndeployApplicationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UndeployApplicationCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/instances`);
  }

  /** @type {CcApiSimpleCommand<UndeployApplicationCommandInput, void>['transformCommandOutput']} */
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
