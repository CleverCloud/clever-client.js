/**
 * @import { ActivateCouponCommandInput, ActivateCouponCommandOutput } from './activate-coupon-command.types.js';
 */
import { post } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

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
 * @extends {CcApiSimpleCommand<ActivateCouponCommandInput, ActivateCouponCommandOutput>}
 * @endpoint [POST] /v4/billing/organisations/:XXX/applied-coupons
 * @group Credits
 * @version 4
 */
export class ActivateCouponCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ActivateCouponCommandInput, ActivateCouponCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return post(safeUrl`/v4/billing/organisations/${params.ownerId}/applied-coupons`, { name: params.couponName });
  }

  /** @type {CcApiSimpleCommand<ActivateCouponCommandInput, ActivateCouponCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      couponName: response.coupon_name,
      usageDate: normalizeDate(response.usageDate),
      freeCreditsStartDate: normalizeDate(response.freeCreditsStartDate),
      freeCreditsEndDate: normalizeDate(response.freeCreditsEndDate),
      appliedByUserId: response.appliedByUserId,
    };
  }

  /** @type {CcApiSimpleCommand<ActivateCouponCommandInput, ActivateCouponCommandOutput>['transformErrorCode']} */
  transformErrorCode(errorCode) {
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
