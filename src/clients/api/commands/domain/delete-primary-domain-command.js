/**
 * @import { DeletePrimaryDomainCommandInput, DeletePrimaryDomainCommandOutput } from './delete-primary-domain-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<DeletePrimaryDomainCommandInput, DeletePrimaryDomainCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class DeletePrimaryDomainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<DeletePrimaryDomainCommandInput, DeletePrimaryDomainCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/:XXX/applications/:XXX/vhosts/favourite`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }
}
