/**
 * @import { CreateDomainCommandInput } from './create-domain-command.types.js';
 */
import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CreateDomainCommandInput, void>}
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/vhosts/:XXX
 * @group Domain
 * @version 2
 */
export class CreateDomainCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreateDomainCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/${params.domain}`,
    );
  }

  /** @type {CcApiSimpleCommand<CreateDomainCommandInput, void>['transformCommandOutput']} */
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
