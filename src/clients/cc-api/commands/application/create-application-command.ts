import { CcClientError } from '../../../../lib/error/cc-client-errors.js';
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { toNameValueObject } from '../../../../utils/environment-utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { ListProductRuntimeCommand } from '../product/list-product-runtime-command.js';
import { transformApplication } from './application-transform.js';
import { consolidateApplicationWithBranches } from './application-utils.js';
import type {
  CreateApplicationCommandInput,
  CreateApplicationCommandOutput,
  CreateApplicationInnerCommandInput,
} from './create-application-command.types.js';

/**
 * Creates an application in an organisation.
 *
 * The runtime can be given either fully qualified or as a variant slug, in which case the latest
 * enabled runtime for that slug is resolved first. The created application is then completed with
 * the branches of its deployment repository.
 *
 * @endpoint [POST] /v2/organisations/:XXX/applications
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/branches
 * @group Application
 * @version 2
 *
 * Default values:
 * - branch: 'master'
 * - buildFlavor: ''
 * - deploy: 'git'
 * - environment: []
 * - maxInstances: 1
 * - minInstances: 1
 * - zone: "par"
 */
export class CreateApplicationCommand extends CcApiCompositeCommand<
  CreateApplicationCommandInput,
  CreateApplicationCommandOutput
> {
  async compose(
    params: CreateApplicationCommandInput,
    composer: CcApiComposer,
  ): Promise<CreateApplicationCommandOutput> {
    // Apply default values
    const paramsWithDefaults: CreateApplicationCommandInput = {
      branch: 'master',
      buildFlavor: '',
      deploy: 'git',
      environment: [],
      maxInstances: 1,
      minInstances: 1,
      zone: 'par',
      ...params,
    };

    let innerParams: CreateApplicationInnerCommandInput;

    if ('slug' in paramsWithDefaults.instance) {
      const slug = paramsWithDefaults.instance.slug;
      const runtimes = await composer.send(new ListProductRuntimeCommand());
      const runtime = runtimes
        .filter((t) => t.isEnabled)
        .filter((t) => t.variant != null && t.variant.slug === slug)
        .sort((a, b) => b.version.localeCompare(a.version))[0];

      if (runtime == null) {
        const supportedSlugs = runtimes
          .filter((t) => t.isEnabled)
          .map((t) => t.variant.slug)
          .sort((a, b) => a.localeCompare(b));

        throw new CcClientError(
          `Cannot find product runtime associated with slug: ${slug}. Supported slugs: [${supportedSlugs.join(', ')}]`,
          'CANNOT_RESOLVE_PRODUCT',
        );
      }
      innerParams = {
        ...paramsWithDefaults,
        instance: {
          type: runtime.type,
          version: runtime.version,
          variant: runtime.variant.id,
        },
      };
    } else {
      innerParams = {
        ...paramsWithDefaults,
        instance: paramsWithDefaults.instance,
      };
    }

    if (innerParams.minFlavor && !innerParams.maxFlavor) {
      innerParams.maxFlavor = innerParams.minFlavor;
    }

    if ((innerParams.buildFlavor?.length ?? 0) > 0) {
      innerParams.hasSeparatedBuild = true;
    }

    const application = await composer.send(new CreateApplicationInnerCommand(innerParams));
    await consolidateApplicationWithBranches(application, composer);
    return application;
  }
}

/**
 * Creates an application, once its runtime has been fully resolved.
 *
 * @endpoint [POST] /v2/organisations/:XXX/applications
 * @group Application
 * @version 2
 */
class CreateApplicationInnerCommand extends CcApiSimpleCommand<
  CreateApplicationInnerCommandInput,
  CreateApplicationCommandOutput
> {
  toRequestParams(params: CreateApplicationInnerCommandInput) {
    const body: Record<string, unknown> = {
      instanceType: params.instance.type,
      instanceVersion: params.instance.version,
      instanceVariant: params.instance.variant,
      applianceId: params.applianceId,
      archived: params.isArchived,
      branch: params.branch,
      buildFlavor: params.buildFlavor,
      cancelOnPush: params.cancelOnPush,
      deploy: params.deploy,
      description: params.description,
      env: toNameValueObject(params.environment ?? []),
      favourite: params.isFavourite,
      homogeneous: params.isZeroDowntimeDeploymentEnabled == null ? undefined : !params.isZeroDowntimeDeploymentEnabled,
      instance: params.instance,
      instanceLifetime: params.instanceLifetime,
      maxFlavor: params.maxFlavor,
      maxInstances: params.maxInstances,
      minFlavor: params.minFlavor,
      minInstances: params.minInstances,
      name: params.name,
      ownerId: params.ownerId,
      publicGitRepositoryUrl: params.publicGitRepositoryUrl,
      separateBuild: params.hasSeparatedBuild,
      shutdownable: params.canShutdown,
      stickySessions: params.hasStickySessions,
      tags: params.tags,
      zone: params.zone,
    };

    if (params.shouldForceHttps != null) {
      body.forceHttps = params.shouldForceHttps ? 'ENABLED' : 'DISABLED';
    }
    if (params.oauthApp?.type === 'github') {
      body.oauthService = 'github';
      body.oauthAppId = params.oauthApp.id;
    }
    return post(safeUrl`/v2/organisations/${params.ownerId}/applications`, body);
  }

  transformCommandOutput(response: unknown): CreateApplicationCommandOutput {
    return transformApplication(response);
  }
}
