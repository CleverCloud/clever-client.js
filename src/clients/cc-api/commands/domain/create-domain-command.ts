import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type { CreateDomainCommandInput } from './create-domain-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_FORMAT`: the given domain is not something the API can work with (bad syntax, IP address,
 *   public suffix, malformed wildcard...)
 * - `ALREADY_USED`: the given domain is already attached to an application, or belongs to a domain the
 *   owner is not allowed to use
 * - `FORBIDDEN`: the given domain has been flagged as forbidden, only the support can unlock it
 */
export const CREATE_DOMAIN_ERROR_CODES = {
  INVALID_FORMAT: 'clever.domain.invalid-format',
  ALREADY_USED: 'clever.domain.already-used',
  FORBIDDEN: 'clever.domain.forbidden',
} as const;

export type CreateDomainErrorCode = (typeof CREATE_DOMAIN_ERROR_CODES)[keyof typeof CREATE_DOMAIN_ERROR_CODES];

const API_ERROR_CODES: Record<string, CreateDomainErrorCode> = {
  '8302': CREATE_DOMAIN_ERROR_CODES.FORBIDDEN,
};

/** The code the endpoint reports for every domain validation failure, whatever the failure is. */
const GENERIC_VALIDATION_ERROR_CODE = '999';

/**
 * FIXME: the endpoint answers `403` with the same generic code for every validation failure, so the
 * message is the only thing left to tell them apart. Drop this as soon as the API gives each failure
 * its own code.
 */
const ERROR_MESSAGE_PATTERNS: Array<[string, CreateDomainErrorCode]> = [
  ['Invalid domain', CREATE_DOMAIN_ERROR_CODES.INVALID_FORMAT],
  ['Could not parse domain', CREATE_DOMAIN_ERROR_CODES.INVALID_FORMAT],
  ['Failed to handle domain', CREATE_DOMAIN_ERROR_CODES.INVALID_FORMAT],
  ['Domain cannot be an IP address or reverse DNS', CREATE_DOMAIN_ERROR_CODES.INVALID_FORMAT],
  ['Domain should be wildcard', CREATE_DOMAIN_ERROR_CODES.INVALID_FORMAT],
  ['belongs to the public suffix list', CREATE_DOMAIN_ERROR_CODES.INVALID_FORMAT],
  ['fqdn is empty', CREATE_DOMAIN_ERROR_CODES.INVALID_FORMAT],
  ['is already taken', CREATE_DOMAIN_ERROR_CODES.ALREADY_USED],
  ['You are not allowed to use', CREATE_DOMAIN_ERROR_CODES.ALREADY_USED],
];

/**
 * Attaches a domain to an application.
 *
 * Common error codes: see {@link CREATE_DOMAIN_ERROR_CODES}
 *
 * @endpoint [PUT] /v2/organisations/:XXX/applications/:XXX/vhosts/:XXX
 * @group Domain
 * @version 2
 */
export class CreateDomainCommand extends CcApiSimpleCommand<CreateDomainCommandInput, undefined> {
  toRequestParams(params: CreateDomainCommandInput) {
    return put(
      safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}/vhosts/${params.domain}`,
    );
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode({ code, message }: ApiErrorInfo) {
    if (code === GENERIC_VALIDATION_ERROR_CODE && message != null) {
      const match = ERROR_MESSAGE_PATTERNS.find(([pattern]) => message.includes(pattern));
      if (match != null) {
        return match[1];
      }
    }

    return API_ERROR_CODES[code] ?? code;
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  // the exact domain is refused as already taken on a replay, so it is only ever attached once
  isIdempotent(): boolean {
    return true;
  }
}
