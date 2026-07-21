import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { SetPrimaryDomainCommandInput } from './set-primary-domain-command.types.js';

/**
 * Marks one of the application's domains as its primary domain.
 *
 * Common error codes:
 * - `clever.domain.not-found`: the given domain is not one of the application's domains
 *
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/vhosts/favourite
 * @group Domain
 * @version 2
 */
export class SetPrimaryDomainCommand extends CcApiSimpleCommand<SetPrimaryDomainCommandInput, undefined> {
  toRequestParams(params: SetPrimaryDomainCommandInput) {
    return put(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/favourite`, {
      fqdn: params.domain,
    });
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode(errorCode: string) {
    // The endpoint answers with the generic "invalid application data" code when the given fqdn does not
    // match any of the application's vhosts, which is the only way this command can produce it.
    if (errorCode === '3004') {
      return 'clever.domain.not-found';
    }
    return errorCode;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
