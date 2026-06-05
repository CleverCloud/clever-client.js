import { normalizeDate } from '../../../../lib/utils.js';
import type { CouponUsage } from './credits.types.js';

export function transformCouponUsage(payload: any): CouponUsage {
  return {
    couponName: payload.coupon_name,
    usageDate: normalizeDate(payload.usageDate)!,
    freeCreditsStartDate: normalizeDate(payload.freeCreditsStartDate)!,
    freeCreditsEndDate: normalizeDate(payload.freeCreditsEndDate)!,
    appliedByUserId: payload.appliedByUserId,
  };
}
