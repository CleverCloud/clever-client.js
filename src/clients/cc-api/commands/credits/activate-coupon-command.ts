import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ActivateCouponCommandInput, ActivateCouponCommandOutput } from './activate-coupon-command.types.js';
import { transformCouponUsage } from './credits-transform.js';

/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `NOT_FOUND`: The coupon doesn't exist
 * - `NOT_VALID_YET`: The coupon is not valid yet
 * - `NO_LONGER_VALID`: The coupon is no longer valid
 * - `USED_TOO_MANY_TIMES`: The coupon has been used too many times
 * - `CURRENCY_MISMATCH`: The currency of the coupon doesn't match the currency of the owner
 * - `ALREADY_ACTIVATED`: The coupon was already activated
 */
export const ACTIVATE_COUPON_ERROR_CODES = {
  NOT_FOUND: 'clever.credits.coupon.not-found',
  NOT_VALID_YET: 'clever.credits.coupon.not-valid-yet',
  NO_LONGER_VALID: 'clever.credits.coupon.no-longer-valid',
  USED_TOO_MANY_TIMES: 'clever.credits.coupon.used-too-many-times',
  CURRENCY_MISMATCH: 'clever.credits.coupon.currency-mismatch',
  ALREADY_ACTIVATED: 'clever.credits.coupon.already-activated',
} as const;

export type ActivateCouponErrorCode = (typeof ACTIVATE_COUPON_ERROR_CODES)[keyof typeof ACTIVATE_COUPON_ERROR_CODES];

const API_ERROR_CODES: Record<string, ActivateCouponErrorCode> = {
  '10001': ACTIVATE_COUPON_ERROR_CODES.NOT_FOUND,
  '10002': ACTIVATE_COUPON_ERROR_CODES.NOT_VALID_YET,
  '10003': ACTIVATE_COUPON_ERROR_CODES.NO_LONGER_VALID,
  '10004': ACTIVATE_COUPON_ERROR_CODES.USED_TOO_MANY_TIMES,
  '10005': ACTIVATE_COUPON_ERROR_CODES.CURRENCY_MISMATCH,
  '10011': ACTIVATE_COUPON_ERROR_CODES.ALREADY_ACTIVATED,
};

/**
 * Activates a coupon
 *
 * Common error codes: see {@link ACTIVATE_COUPON_ERROR_CODES}
 *
 * @endpoint [POST] /v4/billing/organisations/:XXX/applied-coupons
 * @group Credits
 * @version 4
 */
export class ActivateCouponCommand extends CcApiSimpleCommand<ActivateCouponCommandInput, ActivateCouponCommandOutput> {
  toRequestParams(params: ActivateCouponCommandInput) {
    return post(safeUrl`/v4/billing/organisations/${params.ownerId}/applied-coupons`, { name: params.couponName });
  }

  transformCommandOutput(response: unknown): ActivateCouponCommandOutput {
    return transformCouponUsage(response);
  }

  transformErrorCode(errorCode: string) {
    return API_ERROR_CODES[errorCode] ?? errorCode;
  }
}
