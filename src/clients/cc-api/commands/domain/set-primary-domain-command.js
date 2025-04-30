/**
 * @import { SetPrimaryDomainCommandInput } from './set-primary-domain-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<SetPrimaryDomainCommandInput, void>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class SetPrimaryDomainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<SetPrimaryDomainCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/favourite`, {
      fqdn: params.domain,
    });
  }

  /** @type {CcApiSimpleCommand<SetPrimaryDomainCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput(_response) {
    return null;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
