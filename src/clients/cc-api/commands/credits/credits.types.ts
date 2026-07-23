export interface Credits {
  prepaidCredit: number;
  freeCredit: number;
  currency: string;
}

export interface CouponUsage {
  // renamed from coupon_name
  couponName: string;
  // renamed from usageDate
  // transformed: converted to an ISO date string
  usedAt: string;
  // renamed from freeCreditsStartDate
  // transformed: converted to an ISO date string
  freeCreditsStartsAt: string;
  // renamed from freeCreditsEndDate
  // transformed: converted to an ISO date string
  freeCreditsEndsAt: string;
  appliedByUserId: string;
}
