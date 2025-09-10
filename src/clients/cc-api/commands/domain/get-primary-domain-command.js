/**
 * @import { GetPrimaryDomainCommandInput, GetPrimaryDomainCommandOutput } from './get-primary-domain-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformDomain } from './domain-transform.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetPrimaryDomainCommandInput, GetPrimaryDomainCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class GetPrimaryDomainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetPrimaryDomainCommandInput, GetPrimaryDomainCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/favourite`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<GetPrimaryDomainCommandInput, GetPrimaryDomainCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return transformDomain(response, true);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
