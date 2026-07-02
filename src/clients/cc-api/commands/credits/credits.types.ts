export interface Credits {
  prepaidCredit: number;
  freeCredit: number;
  currency: string;
}

export interface CouponUsage {
  // renamed from coupon_name
  couponName: string;
  usageDate: string;
  freeCreditsStartDate: string;
  freeCreditsEndDate: string;
  appliedByUserId: string;
}
