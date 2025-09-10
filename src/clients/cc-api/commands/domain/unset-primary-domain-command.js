/**
 * @import { UnsetPrimaryDomainCommandInput } from './unset-primary-domain-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<UnsetPrimaryDomainCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class UnsetPrimaryDomainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<UnsetPrimaryDomainCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/favourite`);
  }

  /** @type {CcApiSimpleCommand<UnsetPrimaryDomainCommandInput, void>['transformCommandOutput']} */
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
