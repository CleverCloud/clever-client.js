import { put } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { toNameValueObject } from '../../../../utils/environment-utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  UpdateEnvironmentCommandInput,
  UpdateEnvironmentCommandOutput,
} from './update-environment-command.types.ts';

/**
 * Replaces every environment variable of an application at once.
 *
 * Variables left out of the input are removed. The change only reaches the running instances on the
 * next deployment.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}
