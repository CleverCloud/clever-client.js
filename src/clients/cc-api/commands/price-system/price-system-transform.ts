import { sortBy } from '../../../../lib/utils.js';
import type { CountablePricePolicy, PriceSystem } from './price-system.types.js';

export function transformPriceSystem(payload: any): PriceSystem {
  return {
    zone: payload.zone_id ?? undefined,
    currency: payload.currency,
    runtimes: sortBy(
      payload.runtime.map((r: any) => ({
        id: r.runtime_policy_id,
        source: r.source,
        flavor: r.flavor,
        timeUnit: r.time_unit,
        price: r.price,
        priceId: r.slug_id.toLowerCase(),
      })),
      'price',
    ),
    countables: sortBy(payload.countable.map(transformCountable), 'service', 'id'),
  };
}

function transformCountable(payload: any): CountablePricePolicy {
  return {
    id: payload.countable_policy_id,
    service: payload.service,
    dataUnit: payload.data_unit,
    dataQuantityForPrice: payload.data_quantity_for_price,
    timeIntervalForPrice: payload.time_interval_for_price ?? undefined,
    pricePlans: sortBy(
      payload.price_plans.map((p: any) => ({
        planId: p.plan_id,
        maxQuantity: p.max_quantity ?? undefined,
        price: p.price,
      })),
      // Price plans are contiguous quantity intervals; an absent limit means "no limit" and must come last.
      (o) => o.maxQuantity ?? Infinity,
    ),
  };
}
