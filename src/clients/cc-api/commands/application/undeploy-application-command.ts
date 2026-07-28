import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { UndeployApplicationCommandInput } from './undeploy-application-command.types.js';

/**
 * Stops an application by tearing down all of its running instances.
 *
 * The application itself is kept, and can be deployed again later.
 *
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/instances
 * @group Application
 * @version 2
 */
export class UndeployApplicationCommand extends CcApiSimpleCommand<UndeployApplicationCommandInput, undefined> {
  toRequestParams(params: UndeployApplicationCommandInput) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/instances`);
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  // each call queues a stop instruction of its own, with a new deployment id, even on an already
  // stopped application
  isIdempotent(): boolean {
    return false;
  }
}
