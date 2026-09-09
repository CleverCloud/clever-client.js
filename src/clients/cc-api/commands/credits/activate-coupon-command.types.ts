import type { CouponUsage } from './credits.types.js';

/**
 * Which coupon to redeem, and for which organisation.
 */
export interface ActivateCouponCommandInput {
  /** Identifier of the user or organisation redeeming the coupon. */
  ownerId: string;
  /**
   * Name of the coupon, as printed on it.
   * @sentAs `name`
   */
  couponName: string;
}

/**
 * The record of the redemption, with the free credits window it opened.
 */
export type ActivateCouponCommandOutput = CouponUsage;
