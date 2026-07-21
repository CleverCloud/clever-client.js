import { QueryParams } from '../../../../lib/request/query-params.js';
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  DeployApplicationCommandInput,
  DeployApplicationCommandOutput,
} from './deploy-application-command.types.js';

/**
 * Deploys an application.
 *
 * Common error codes:
 * - `clever.application.never-deployed`: the application has never been deployed, there is no commit to deploy
 *
 * @endpoint [POST] /v2/organisations/:XXX/applications/:XXX/instances
 * @group Application
 * @version 2
 */
export class DeployApplicationCommand extends CcApiSimpleCommand<
  DeployApplicationCommandInput,
  DeployApplicationCommandOutput
> {
  toRequestParams(params: DeployApplicationCommandInput) {
    return post(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/instances`,
      null,
      new QueryParams({
        commit: params.commit,
        useCache: params.useCache === false ? 'no' : null,
      }),
    );
  }

  transformCommandOutput(response: unknown): DeployApplicationCommandOutput {
    return {
      deploymentId: (response as { deploymentId: string }).deploymentId,
    };
  }

  transformErrorCode(errorCode: string) {
    if (errorCode === '4014') {
      return 'clever.application.never-deployed';
    }
    return errorCode;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
