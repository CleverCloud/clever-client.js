import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { SetPrimaryDomainCommandInput } from './set-primary-domain-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `NOT_FOUND`: the given domain is not one of the application's domains
 */
export const SET_PRIMARY_DOMAIN_ERROR_CODES = {
  NOT_FOUND: 'clever.domain.not-found',
} as const;

export type SetPrimaryDomainErrorCode =
  (typeof SET_PRIMARY_DOMAIN_ERROR_CODES)[keyof typeof SET_PRIMARY_DOMAIN_ERROR_CODES];

const API_ERROR_CODES: Record<string, SetPrimaryDomainErrorCode> = {
  // The endpoint answers with the generic "invalid application data" code when the given fqdn does not
  // match any of the application's vhosts, which is the only way this command can produce it.
  '3004': SET_PRIMARY_DOMAIN_ERROR_CODES.NOT_FOUND,
};

/**
 * Marks one of the application's domains as its primary domain.
 *
 * Common error codes: see {@link SET_PRIMARY_DOMAIN_ERROR_CODES}
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
    return API_ERROR_CODES[errorCode] ?? errorCode;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
