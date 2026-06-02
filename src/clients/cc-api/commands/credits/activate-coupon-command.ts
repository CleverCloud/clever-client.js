import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { ActivateCouponCommandInput, ActivateCouponCommandOutput } from './activate-coupon-command.types.js';
import { transformCouponUsage } from './credits-transform.js';

/**
 * Activates a coupon
 *
 * Common error codes:
 * - `clever.credits.coupon.not-found`: The coupon doesn't exist
 * - `clever.credits.coupon.not-valid-yet`: The coupon is not valid yet
 * - `clever.credits.coupon.no-longer-valid`: The coupon is no longer valid
 * - `clever.credits.coupon.used-too-many-times`: The coupon has been used too many times
 * - `clever.credits.coupon.currency-mismatch`: The currency of the coupon doesn't match the currency of the owner
 * - `clever.credits.coupon.already-activated`: The coupon was already activated
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
    if (errorCode === '10001') {
      return 'clever.credits.coupon.not-found';
    }
    if (errorCode === '10002') {
      return 'clever.credits.coupon.not-valid-yet';
    }
    if (errorCode === '10003') {
      return 'clever.credits.coupon.no-longer-valid';
    }
    if (errorCode === '10004') {
      return 'clever.credits.coupon.used-too-many-times';
    }
    if (errorCode === '10005') {
      return 'clever.credits.coupon.currency-mismatch';
    }
    if (errorCode === '10011') {
      return 'clever.credits.coupon.already-activated';
    }

    return errorCode;
  }
}
