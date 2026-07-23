import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformLinkToAddon, transformLinkToApplication } from './link-transform.js';
import type { LinkToAddon, LinkToApplication } from './link.types.js';
import type {
  ListAddonLinkCommandInput,
  ListApplicationLinkCommandInput,
  ListLinkCommandInput,
  ListLinkCommandOutput,
} from './list-link-command.types.js';

/**
 * Lists what a resource is linked to.
 *
 * For an application, that is the applications and the add-ons it depends on, fetched in parallel
 * and merged into one list. For an add-on, that is the applications consuming it.
 *
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/applications
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/dependencies
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/addons
 * @group Link
 * @version 2
 */
export class ListLinkCommand extends CcApiCompositeCommand<ListLinkCommandInput, ListLinkCommandOutput> {
  async compose(params: ListLinkCommandInput, composer: CcApiComposer): Promise<ListLinkCommandOutput> {
    if ('applicationId' in params) {
      return Promise.all([
        composer.send(new ListApplicationToApplicationLinkCommand(params)),
        composer.send(new ListApplicationToAddonLinkCommand(params)),
      ]).then(([applicationToApplication, applicationToAddon]) => [...applicationToApplication, ...applicationToAddon]);
    }

    return composer.send(new ListAddonToApplicationLinkCommand(params));
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}

/**
 * Lists the applications an application depends on.
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/dependencies
 * @group Link
 * @version 2
 */
class ListApplicationToApplicationLinkCommand extends CcApiSimpleCommand<
  ListApplicationLinkCommandInput,
  Array<LinkToApplication>
> {
  toRequestParams(params: ListApplicationLinkCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/dependencies`);
  }

  transformCommandOutput(response: unknown): Array<LinkToApplication> {
    return sortBy(
      (response as Array<unknown>).map(transformLinkToApplication),
      (link) => link.application.name,
      (link) => link.application.id,
    );
  }
}

/**
 * Lists the add-ons an application depends on.
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/addons
 * @group Link
 * @version 2
 */
class ListApplicationToAddonLinkCommand extends CcApiSimpleCommand<
  ListApplicationLinkCommandInput,
  Array<LinkToAddon>
> {
  toRequestParams(params: ListApplicationLinkCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/addons`);
  }

  transformCommandOutput(response: unknown): Array<LinkToAddon> {
    return sortBy(
      (response as Array<unknown>).map(transformLinkToAddon),
      (link) => link.addon.name,
      (link) => link.addon.id,
    );
  }
}

/**
 * Lists the applications consuming an add-on.
 *
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/applications
 * @group Link
 * @version 2
 */
class ListAddonToApplicationLinkCommand extends CcApiSimpleCommand<
  ListAddonLinkCommandInput,
  Array<LinkToApplication>
> {
  toRequestParams(params: ListAddonLinkCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/applications`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'ADDON_ID',
    };
  }

  transformCommandOutput(response: unknown): Array<LinkToApplication> {
    return sortBy(
      (response as Array<unknown>).map(transformLinkToApplication),
      (link) => link.application.name,
      (link) => link.application.id,
    );
  }
}
