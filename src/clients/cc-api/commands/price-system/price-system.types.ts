export interface PriceSystem {
  // renamed from zone_id
  zone?: string;
  currency: string;
  runtime: Array<RuntimePricePolicy>;
  countable: Array<CountablePricePolicy>;
}

export interface RuntimePricePolicy {
  // renamed from runtime_policy_id
  id: string;
  source: string;
  flavor: string;
  // renamed from time_unit
  timeUnit: string;
  price: number;
  // renamed from slug_id and transformed to lower case
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
  pricePlans: Array<CountablePricePlan>;
}

export interface BillableQuantity {
  secability: 'SECABLE' | 'INSECABLE';
  quantity: number;
}

export interface BillableTime {
  secability: 'SECABLE' | 'INSECABLE';
  interval: number;
}

export interface CountablePricePlan {
  // renamed from plan_id
  planId: string;
  // renamed from max_quantity
  maxQuantity?: number;
  price: number;
}
