import { put } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { toNameValueObject } from '../../../../utils/environment-utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { UpdateExposedEnvironmentCommandInput } from './update-exposed-environment-command.types.ts';

/**
 * Replaces the configuration an application exposes to the applications linked to it.
 *
 * Variables left out of the input stop being exposed.
 *
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

  // the endpoint redeploys every application linked to this one, so a replay queues a second deployment
  isIdempotent(): boolean {
    return false;
  }
}
