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
 * Updates an application.
 *
 * Only the given fields are changed. The branch lives behind its own endpoint, so setting it costs
 * an extra request. The updated application is then completed with the branches of its deployment
 * repository.
 *
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/branch
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/branches
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
 * Updates every application field but the branch.
 *
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
      ...omit(
        params,
        'ownerId',
        'applicationId',
        'environment',
        'isArchived',
        'isFavourite',
        'shouldForceHttps',
        'isZeroDowntimeDeploymentEnabled',
        'hasSeparatedBuild',
        'canShutdown',
        'hasStickySessions',
      ),
    };
    if (params.isArchived != null) {
      body.archived = params.isArchived;
    }
    if (params.isFavourite != null) {
      body.favourite = params.isFavourite;
    }
    if (params.isZeroDowntimeDeploymentEnabled != null) {
      body.homogeneous = !params.isZeroDowntimeDeploymentEnabled;
    }
    if (params.hasSeparatedBuild != null) {
      body.separateBuild = params.hasSeparatedBuild;
    }
    if (params.canShutdown != null) {
      body.shutdownable = params.canShutdown;
    }
    if (params.hasStickySessions != null) {
      body.stickySessions = params.hasStickySessions;
    }
    if (params.environment != null) {
      body.env = toNameValueObject(params.environment);
    }
    if (params.instanceLifetime != null) {
      body.instanceLifetime = params.instanceLifetime;
    }
    if (params.shouldForceHttps != null) {
      body.forceHttps = params.shouldForceHttps ? 'ENABLED' : 'DISABLED';
    }

    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}`, body);
  }

  transformCommandOutput(response: unknown): UpdateApplicationCommandOutput {
    return transformApplication(response);
  }
}

/**
 * Changes the branch an application deploys from.
 *
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/branch
 * @group Application
 * @version 2
 */
class UpdateApplicationBranchCommand extends CcApiSimpleCommand<UpdateApplicationBranchCommandInput, undefined> {
  toRequestParams(params: UpdateApplicationBranchCommandInput) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/branch`, {
      branch: params.branch,
    });
  }

  transformCommandOutput(): undefined {
    return undefined;
  }
}
