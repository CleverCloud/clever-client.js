import type { CouponUsage } from './credits.types.js';

export interface ActivateCouponCommandInput {
  ownerId: string;
  couponName: string;
}

export type ActivateCouponCommandOutput = CouponUsage;
