import { normalizeDate } from '../../../../lib/utils.js';
import type { CouponUsage } from './credits.types.js';

export function transformCouponUsage(payload: any): CouponUsage {
  return {
    couponName: payload.coupon_name,
    usedAt: normalizeDate(payload.usageDate)!,
    freeCreditsStartsAt: normalizeDate(payload.freeCreditsStartDate)!,
    freeCreditsEndsAt: normalizeDate(payload.freeCreditsEndDate)!,
    appliedByUserId: payload.appliedByUserId,
  };
}
