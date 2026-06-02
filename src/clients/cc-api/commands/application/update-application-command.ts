import { put } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { toNameValueObject } from '../../../../utils/environment-utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformApplication } from './application-transform.js';
import { consolidateApplicationWithBranches } from './application-utils.js';
import type {
  UpdateApplicationBranchCommandInput,
  UpdateApplicationCommandInput,
  UpdateApplicationCommandOutput,
} from './update-application-command.types.js';

/**
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX
 * @group Application
 * @version 2
 */
export class UpdateApplicationCommand extends CcApiCompositeCommand<
  UpdateApplicationCommandInput,
  UpdateApplicationCommandOutput
> {
  async compose(
    params: UpdateApplicationCommandInput,
    composer: CcApiComposer,
  ): Promise<UpdateApplicationCommandOutput> {
    if (params.branch != null) {
      await composer.send(
        new UpdateApplicationBranchCommand({
          ownerId: params.ownerId,
          applicationId: params.applicationId,
          branch: params.branch,
        }),
      );
    }

    const application = await composer.send(new UpdateApplicationInnerCommand(params));
    await consolidateApplicationWithBranches(application, composer);
    return application;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}

/**
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX
 * @group Application
 * @version 2
 */
class UpdateApplicationInnerCommand extends CcApiSimpleCommand<
  UpdateApplicationCommandInput,
  UpdateApplicationCommandOutput
> {
  toRequestParams(params: UpdateApplicationCommandInput) {
    const body: Record<string, unknown> = {
      ...omit(params, 'ownerId', 'applicationId', 'environment'),
    };
    if (params.environment != null) {
      body.env = toNameValueObject(params.environment);
    }
    if (params.instanceLifetime != null) {
      body.instanceLifetime = params.instanceLifetime;
    }
    if (params.forceHttps != null) {
      body.forceHttps = params.forceHttps ? 'ENABLED' : 'DISABLED';
    }

    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}`, body);
  }

  transformCommandOutput(response: unknown): UpdateApplicationCommandOutput {
    return transformApplication(response);
  }
}

/**
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/branch
 * @group Application
 * @version 2
 */
class UpdateApplicationBranchCommand extends CcApiSimpleCommand<UpdateApplicationBranchCommandInput, void> {
  toRequestParams(params: UpdateApplicationBranchCommandInput) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/branch`, {
      branch: params.branch,
    });
  }
}
