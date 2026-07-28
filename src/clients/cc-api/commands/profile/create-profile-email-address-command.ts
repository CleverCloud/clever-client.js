import { put } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { ApiErrorInfo } from '../../../../types/command.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CreateProfileEmailAddressCommandInput } from './create-profile-email-address-command.types.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_FORMAT`: the email address format is invalid
 * - `ALREADY_DEFINED`: the email address already belongs to the user
 * - `ALREADY_USED`: the email address already belongs to another user
 */
export const CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES = {
  INVALID_FORMAT: 'clever.profile.email-address.invalid-format',
  ALREADY_DEFINED: 'clever.profile.email-address.already-defined',
  ALREADY_USED: 'clever.profile.email-address.already-used',
} as const;

export type CreateProfileEmailAddressErrorCode =
  (typeof CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES)[keyof typeof CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES];

const API_ERROR_CODES: Record<string, CreateProfileEmailAddressErrorCode> = {
  '550': CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES.INVALID_FORMAT,
  '101': CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES.ALREADY_DEFINED,
  '1004': CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES.ALREADY_USED,
};

/**
 * Adds a new email address to the user profile.
 *
 * Common error codes: see {@link CREATE_PROFILE_EMAIL_ADDRESS_ERROR_CODES}
 *
 * @endpoint [PUT] /v2/self/emails/:XXX
 * @group Profile
 * @version 2
 */
export class CreateProfileEmailAddressCommand extends CcApiSimpleCommand<
  CreateProfileEmailAddressCommandInput,
  undefined
> {
  toRequestParams(params: CreateProfileEmailAddressCommandInput) {
    return put(safeUrl`/v2/self/emails/${params.address}`, {});
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  transformErrorCode({ code }: ApiErrorInfo) {
    return API_ERROR_CODES[code] ?? code;
  }

  // the address is only stored once the mailed link is followed, so a replay mails a second link
  isIdempotent(): boolean {
    return false;
  }
}
