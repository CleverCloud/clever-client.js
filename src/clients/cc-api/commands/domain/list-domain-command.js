/**
 * @import { ListDomainCommandInput, ListDomainCommandOutput } from './list-domain-command.types.js';
 * @import { Domain } from './domain.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformDomain } from './domain-transform.js';
import { GetPrimaryDomainCommand } from './get-primary-domain-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<ListDomainCommandInput, ListDomainCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts
 * @group Domain
 * @version 2
 */
export class ListDomainCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<ListDomainCommandInput, ListDomainCommandOutput>['compose']} */
  async compose(params, composer) {
    return Promise.all([
      composer.send(new ListDomainInnerCommand(params)),
      composer.send(new GetPrimaryDomainCommand(params)),
    ]).then(([domains, primaryDomain]) =>
      domains.map((domain) => ({
        ...domain,
        isPrimary: domain.domain === primaryDomain?.domain,
      })),
    );
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
 * @extends {CcApiSimpleCommand<ListDomainCommandInput, Array<Domain>>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts
 * @group Domain
 * @version 2
 */
class ListDomainInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListDomainCommandInput, Array<Domain>>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404, emptyValue: [] };
  }

  /** @type {CcApiSimpleCommand<ListDomainCommandInput, Array<Domain>>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return sortBy(response.map(transformDomain), 'domain');
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
