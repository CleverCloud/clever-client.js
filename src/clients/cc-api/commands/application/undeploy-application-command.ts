import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { UndeployApplicationCommandInput } from './undeploy-application-command.types.js';

/**
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/instances
 * @group Application
 * @version 2
 */
export class UndeployApplicationCommand extends CcApiSimpleCommand<UndeployApplicationCommandInput, void> {
  toRequestParams(params: UndeployApplicationCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/instances`);
  }

  transformCommandOutput(): void {
    return null;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
