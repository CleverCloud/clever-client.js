/**
 * @import { CreateApplicationCommandInput, CreateApplicationCommandOutput, CreateApplicationInternalCommandInput } from './create-application-command.types.js';
 */
import { CcClientError } from '../../../../lib/error/cc-client-errors.js';
import { post } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { ListProductRuntimeCommand } from '../product/list-product-runtime-command.js';
import { transformApplication } from './application-transform.js';

/**
 *
 * @extends {CcApiCompositeCommand<CreateApplicationCommandInput, CreateApplicationCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/applications
 * @group Application
 * @version 2
 */
export class CreateApplicationCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<CreateApplicationCommandInput, CreateApplicationCommandOutput>['compose']} */
  async compose(params, composer) {
    /** @type {CreateApplicationInternalCommandInput} */
    let internalParams;

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
      internalParams = {
        ...params,
        instance: {
          type: runtime.type,
          version: runtime.version,
          variant: runtime.variant.id,
        },
      };
    } else {
      internalParams = {
        ...params,
        instance: params.instance,
      };
    }

    return composer.send(new CreateApplicationInternalCommand(internalParams));
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<CreateApplicationInternalCommandInput, CreateApplicationCommandOutput>}
 * @endpoint [POST] /v2/organisations/:XXX/applications
 * @group Application
 * @version 2
 */
class CreateApplicationInternalCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateApplicationInternalCommandInput, CreateApplicationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    /** @type {any} */
    const body = {
      ...omit(params, 'ownerId', 'instance'),
      instanceType: params.instance.type,
      instanceVersion: params.instance.version,
      instanceVariant: params.instance.variant,
    };
    if (params.forceHttps != null) {
      body.forceHttps = params.forceHttps ? 'ENABLED' : 'DISABLED';
    }
    if (params.oauthApp != null && params.oauthApp.type === 'github') {
      body.oauthApp = {
        owner: params.oauthApp.owner,
        name: params.oauthApp.name,
      };
      body.oauthService = 'github';
      body.oauthAppId = params.oauthApp.id;
    }
    return post(safeUrl`/v2/organisations/${params.ownerId}/applications`, body);
  }

  /** @type {CcApiSimpleCommand<CreateApplicationInternalCommandInput, CreateApplicationCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformApplication(response);
  }
}
