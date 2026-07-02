import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { toNameValueObject } from '../../../../utils/environment-utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { UpdateExposedEnvironmentCommandInput } from './update-exposed-environment-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/exposed_env
 * @group Environment
 * @version 2
 */
export class UpdateExposedEnvironmentCommand extends CcApiSimpleCommand<
  UpdateExposedEnvironmentCommandInput,
  undefined
> {
  toRequestParams(params: UpdateExposedEnvironmentCommandInput) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/exposed_env`,
      toNameValueObject(params.environment),
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
