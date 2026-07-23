export interface PriceSystem {
  // renamed from zone_id
  zone?: string;
  currency: string;
  // renamed from runtime
  // transformed: sorted by price
  runtimes: Array<RuntimePricePolicy>;
  // renamed from countable
  // transformed: sorted by dataQuantityForPrice, then timeIntervalForPrice
  countables: Array<CountablePricePolicy>;
}

export interface RuntimePricePolicy {
  // renamed from runtime_policy_id
  id: string;
  source: string;
  flavor: string;
  // renamed from time_unit
  timeUnit: string;
  price: number;
  // renamed from slug_id
  // transformed: lowercased
  priceId: string;
}

export interface CountablePricePolicy {
  // renamed from countable_policy_id
  id: string;
  service: string;
  // renamed from data_unit
  dataUnit: string;
  // renamed from data_quantity_for_price
  dataQuantityForPrice: BillableQuantity;
  // renamed from time_interval_for_price
  timeIntervalForPrice?: BillableTime;
  // renamed from price_plans
  // transformed: sorted by maxQuantity, the unlimited plan last
  pricePlans: Array<CountablePricePlan>;
}

export type Secability = 'secable' | 'insecable';

export interface BillableQuantity {
  secability: Secability;
  quantity: number;
}

export interface BillableTime {
  secability: Secability;
  // ISO-8601 duration
  interval: string;
}

export interface CountablePricePlan {
  // renamed from plan_id
  planId: string;
  // renamed from max_quantity
  maxQuantity?: number;
  price: number;
}
