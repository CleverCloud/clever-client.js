import { put } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl, sortBy } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  CreateOrUpdateEnvironmentVariableCommandInput,
  CreateOrUpdateEnvironmentVariableCommandOutput,
} from './create-or-update-environment-variable-command.types.ts';

/**
 * Sets one environment variable on an application, creating it when it does not exist yet.
 *
 * The change only reaches the running instances on the next deployment.
 *
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/env/:XXX
 * @group Environment
 * @version 2
 */
export class CreateOrUpdateEnvironmentVariableCommand extends CcApiSimpleCommand<
  CreateOrUpdateEnvironmentVariableCommandInput,
  CreateOrUpdateEnvironmentVariableCommandOutput
> {
  toRequestParams(params: CreateOrUpdateEnvironmentVariableCommandInput) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/env/${params.name}`, {
      value: params.value,
    });
  }

  transformCommandOutput(response: unknown): CreateOrUpdateEnvironmentVariableCommandOutput {
    return sortBy((response as { env: CreateOrUpdateEnvironmentVariableCommandOutput }).env, 'name');
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
