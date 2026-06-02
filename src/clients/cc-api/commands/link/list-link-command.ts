/**
 * @import { ListLinkCommandInput, ListLinkCommandOutput, ListApplicationLinkCommandInput, ListAddonLinkCommandInput } from './list-link-command.types.js';
 * @import { LinkToApplication, LinkToAddon } from './link.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformLinkToAddon, transformLinkToApplication } from './link-transform.js';

/**
 *
 * @extends {CcApiCompositeCommand<ListLinkCommandInput, ListLinkCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/applications
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/dependencies
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/addons
 * @group Link
 * @version 2
 */
export class ListLinkCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<ListLinkCommandInput, ListLinkCommandOutput>['compose']} */
  async compose(params, composer) {
    if ('applicationId' in params) {
      return Promise.all([
        composer.send(new ListApplicationToApplicationLinkCommand(params)),
        composer.send(new ListApplicationToAddonLinkCommand(params)),
      ]).then(([applicationToApplication, applicationToAddon]) => [...applicationToApplication, ...applicationToAddon]);
    }

    return composer.send(new ListAddonToApplicationLinkCommand(params));
  }

  /** @type {CcApiCompositeCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<ListApplicationLinkCommandInput, Array<LinkToApplication>>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/dependencies/:XXX
 * @group Link
 * @version 2
 */
class ListApplicationToApplicationLinkCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListApplicationLinkCommandInput, Array<LinkToApplication>>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/dependencies`);
  }

  /** @type {CcApiSimpleCommand<ListApplicationLinkCommandInput, Array<LinkToApplication>>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(
      response.map(transformLinkToApplication),
      (link) => link.application.name,
      (link) => link.application.id,
    );
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<ListApplicationLinkCommandInput, Array<LinkToAddon>>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/addons
 * @group Link
 * @version 2
 */
class ListApplicationToAddonLinkCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListApplicationLinkCommandInput, Array<LinkToAddon>>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/addons`);
  }

  /** @type {CcApiSimpleCommand<ListApplicationLinkCommandInput, Array<LinkToAddon>>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(
      response.map(transformLinkToAddon),
      (link) => link.addon.name,
      (link) => link.addon.id,
    );
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<ListAddonLinkCommandInput, Array<LinkToApplication>>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/applications
 * @group Link
 * @version 2
 */
class ListAddonToApplicationLinkCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListAddonLinkCommandInput, Array<LinkToApplication>>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/applications`);
  }

  /** @type {CcApiCompositeCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'ADDON_ID',
    };
  }

  /** @type {CcApiSimpleCommand<ListAddonLinkCommandInput, Array<LinkToApplication>>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(
      response.map(transformLinkToApplication),
      (link) => link.application.name,
      (link) => link.application.id,
    );
  }
}
