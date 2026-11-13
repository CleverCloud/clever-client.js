import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { toArray } from '../../../../utils/environment-utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetExposedEnvironmentCommandInput,
  GetExposedEnvironmentCommandOutput,
} from './get-exposed-environment-command.types.ts';

/**
 * Reads the configuration an application exposes to the applications linked to it.
 *
 * This is what other applications see, as opposed to the variables the application itself runs with.
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/exposed_env
 * @group Environment
 * @version 2
 */
export class GetExposedEnvironmentCommand extends CcApiSimpleCommand<
  GetExposedEnvironmentCommandInput,
  GetExposedEnvironmentCommandOutput
> {
  toRequestParams(params: GetExposedEnvironmentCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/exposed_env`);
  }

  transformCommandOutput(response: unknown): GetExposedEnvironmentCommandOutput {
    return sortBy(toArray(response as Record<string, string>), 'name');
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
