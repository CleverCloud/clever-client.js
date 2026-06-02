import { sortBy } from '../../../../lib/utils.js';
import type { CountablePricePolicy, PriceSystem } from './price-system.types.js';

export function transformPriceSystem(payload: any): PriceSystem {
  sortBy(
    [].map((p: any) => ({
      planId: p.plan_id,
      maxQuantity: p.max_quantity,
      price: p.price,
    })),
    'price',
  );

  return {
    zone: payload.zone_id,
    currency: payload.currency,
    runtime: sortBy(
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
    countable: sortBy(payload.countable.map(transformCountable), 'dataQuantityForPrice', 'timeIntervalForPrice'),
  };
}

function transformCountable(payload: any): CountablePricePolicy {
  return {
    id: payload.countable_policy_id,
    service: payload.service,
    dataUnit: payload.data_unit,
    dataQuantityForPrice: payload.data_quantity_for_price,
    timeIntervalForPrice: payload.time_interval_for_price,
    pricePlans: sortBy(
      payload.price_plans.map((p: any) => ({
        planId: p.plan_id,
        maxQuantity: p.max_quantity,
        price: p.price,
      })),
      'price',
    ),
  };
}
