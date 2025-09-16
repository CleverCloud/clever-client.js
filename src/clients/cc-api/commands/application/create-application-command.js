/**
 * @import { CreateApplicationCommandInput, CreateApplicationCommandOutput, CreateApplicationInnerCommandInput } from './create-application-command.types.js';
 */
import { CcClientError } from '../../../../lib/error/cc-client-errors.js';
import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { toNameValueObject } from '../../../../utils/environment-utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { ListProductRuntimeCommand } from '../product/list-product-runtime-command.js';
import { transformApplication } from './application-transform.js';
import { consolidateApplicationWithBranches } from './application-utils.js';

/**
 *
 * @extends {CcApiCompositeCommand<CreateApplicationCommandInput, CreateApplicationCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/applications
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/branches
 * @group Application
 * @version 2
 */
export class CreateApplicationCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<CreateApplicationCommandInput, CreateApplicationCommandOutput>['compose']} */
  async compose(params, composer) {
    /** @type {CreateApplicationInnerCommandInput} */
    let innerParams;

    if ('slug' in params.instance) {
      const slug = params.instance.slug;
      const runtimes = await composer.send(new ListProductRuntimeCommand());
      const runtime = runtimes
        .filter((t) => t.enabled)
        .filter((t) => t.variant != null && t.variant.slug === slug)
        .sort((a, b) => b.version.localeCompare(a.version))[0];

      if (runtime == null) {
        const supportedSlugs = runtimes
          .filter((t) => t.enabled)
          .map((t) => t.variant.slug)
          .sort((a, b) => a.localeCompare(b));

        throw new CcClientError(
          `Cannot find product runtime associated with slug: ${slug}. Supported slugs: [${supportedSlugs.join(', ')}]`,
          'CANNOT_RESOLVE_PRODUCT',
        );
      }
      innerParams = {
        ...params,
        instance: {
          type: runtime.type,
          version: runtime.version,
          variant: runtime.variant.id,
        },
      };
    } else {
      innerParams = {
        ...params,
        instance: params.instance,
      };
    }

    const application = await composer.send(new CreateApplicationInnerCommand(innerParams));
    await consolidateApplicationWithBranches(application, composer);
    return application;
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<CreateApplicationInnerCommandInput, CreateApplicationCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/applications
 * @group Application
 * @version 2
 */
class CreateApplicationInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateApplicationInnerCommandInput, CreateApplicationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    /** @type {any} */
    const body = {
      instanceType: params.instance.type,
      instanceVersion: params.instance.version,
      instanceVariant: params.instance.variant,
      applianceId: params.applianceId,
      archived: params.archived,
      branch: params.branch,
      buildFlavor: params.buildFlavor,
      cancelOnPush: params.cancelOnPush,
      deploy: params.deploy,
      description: params.description,
      env: toNameValueObject(params.environment),
      favourite: params.favourite,
      homogeneous: params.homogeneous,
      instance: params.instance,
      instanceLifetime: params.instanceLifetime,
      maxFlavor: params.maxFlavor,
      maxInstances: params.maxInstances,
      minFlavor: params.minFlavor,
      minInstances: params.minInstances,
      name: params.name,
      ownerId: params.ownerId,
      publicGitRepositoryUrl: params.publicGitRepositoryUrl,
      separateBuild: params.separateBuild,
      shutdownable: params.shutdownable,
      stickySessions: params.stickySessions,
      tags: params.tags,
      zone: params.zone,
    };

    if (params.forceHttps != null) {
      body.forceHttps = params.forceHttps ? 'ENABLED' : 'DISABLED';
    }
    if (params.oauthApp?.type === 'github') {
      body.oauthService = 'github';
      body.oauthAppId = params.oauthApp.id;
    }
    return post(safeUrl`/v2/organisations/${params.ownerId}/applications`, body);
  }

  /** @type {CcApiSimpleCommand<CreateApplicationInnerCommandInput, CreateApplicationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformApplication(response);
  }
}
