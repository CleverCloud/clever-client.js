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
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `NEVER_DEPLOYED`: the application has never been deployed, there is no commit to deploy
 */
export const DEPLOY_APPLICATION_ERROR_CODES = {
  NEVER_DEPLOYED: 'clever.application.never-deployed',
} as const;

export type DeployApplicationErrorCode =
  (typeof DEPLOY_APPLICATION_ERROR_CODES)[keyof typeof DEPLOY_APPLICATION_ERROR_CODES];

const API_ERROR_CODES: Record<string, DeployApplicationErrorCode> = {
  '4014': DEPLOY_APPLICATION_ERROR_CODES.NEVER_DEPLOYED,
};

/**
 * Deploys an application.
 *
 * Common error codes: see {@link DEPLOY_APPLICATION_ERROR_CODES}
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
    return API_ERROR_CODES[errorCode] ?? errorCode;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
