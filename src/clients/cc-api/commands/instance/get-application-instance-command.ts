import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetApplicationInstanceCommandInput,
  GetApplicationInstanceCommandOutput,
} from './get-application-instance-command.types.ts';
import { transformApplicationInstance } from './instance-transform.ts';

/**
 * Retrieves one instance of an application.
 *
 * Instances are kept after they are destroyed, so a deleted instance can still be retrieved: its `deletedAt`
 * tells it apart from a live one.
 *
 * @endpoint [GET] /v4/orchestration/organisations/:XXX/applications/:XXX/instances/:XXX
 * @group Instance
 * @version 4
 */
export class GetApplicationInstanceCommand extends CcApiSimpleCommand<
  GetApplicationInstanceCommandInput,
  GetApplicationInstanceCommandOutput
> {
  toRequestParams(params: GetApplicationInstanceCommandInput) {
    return get(
      safeUrl`/v4/orchestration/organisations/${params.ownerId}/applications/${params.applicationId}/instances/${params.instanceId}`,
    );
  }

  transformCommandOutput(response: unknown): GetApplicationInstanceCommandOutput {
    return transformApplicationInstance(response);
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
