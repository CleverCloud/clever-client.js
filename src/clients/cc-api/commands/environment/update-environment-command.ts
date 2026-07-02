import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { toNameValueObject } from '../../../../utils/environment-utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  UpdateEnvironmentCommandInput,
  UpdateEnvironmentCommandOutput,
} from './update-environment-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/env
 * @group Environment
 * @version 2
 */
export class UpdateEnvironmentCommand extends CcApiSimpleCommand<
  UpdateEnvironmentCommandInput,
  UpdateEnvironmentCommandOutput
> {
  toRequestParams(params: UpdateEnvironmentCommandInput) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env`,
      toNameValueObject(params.environment),
    );
  }

  transformCommandOutput(response: unknown): UpdateEnvironmentCommandOutput {
    return sortBy((response as { env: UpdateEnvironmentCommandOutput }).env, 'name');
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
