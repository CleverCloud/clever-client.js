/**
 * What an organisation has left to spend before it is invoiced: credits bought up front and
 * credits granted for free.
 */
export interface Credits {
  /** Credits bought up front and not consumed yet. */
  prepaidCredit: number;
  /** Credits granted for free, typically by a coupon, and not consumed yet. */
  freeCredit: number;
  /** Currency both amounts are expressed in. */
  currency: string;
}

/**
 * The record of a coupon being redeemed by an organisation, and the free credits window it opened.
 */
export interface CouponUsage {
  /**
   * Name of the coupon that was redeemed.
   * @renamedFrom `coupon_name`
   */
  couponName: string;
  /**
   * When the coupon was redeemed.
   * @renamedFrom `usageDate`
   * @converted to an ISO date string
   */
  usedAt: string;
  /**
   * When the free credits start being usable.
   * @renamedFrom `freeCreditsStartDate`
   * @converted to an ISO date string
   */
  freeCreditsStartsAt: string;
  /**
   * When the free credits expire.
   * @renamedFrom `freeCreditsEndDate`
   * @converted to an ISO date string
   */
  freeCreditsEndsAt: string;
  /** Identifier of the user who redeemed the coupon. */
  appliedByUserId: string;
}
