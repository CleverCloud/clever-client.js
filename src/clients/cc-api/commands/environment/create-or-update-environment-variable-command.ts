import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  CreateOrUpdateEnvironmentVariableCommandInput,
  CreateOrUpdateEnvironmentVariableCommandOutput,
} from './create-or-update-environment-variable-command.types.js';

/**
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
}
