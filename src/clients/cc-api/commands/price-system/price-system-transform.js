/**
 * @import { PriceSystem, CountablePricePolicy } from './price-system.types.js'
 */

import { sortBy } from '../../../../lib/utils.js';

/**
 * @param {any} payload
 * @returns {PriceSystem}
 */
export function transformPriceSystem(payload) {
  sortBy(
    [].map(
      /** @param {any} p */ (p) => ({
        planId: p.plan_id,
        maxQuantity: p.max_quantity,
        price: p.price,
      }),
    ),
    'price',
  );

  return {
    zone: payload.zone_id,
    currency: payload.currency,
    runtime: sortBy(
      payload.runtime.map(
        /** @param {any} r */ (r) => ({
          id: r.runtime_policy_id,
          source: r.source,
          flavor: r.flavor,
          timeUnit: r.time_unit,
          price: r.price,
          priceId: r.slug_id.toLowerCase(),
        }),
      ),
      'price',
    ),
    countable: sortBy(payload.countable.map(transformCountable), 'dataQuantityForPrice', 'timeIntervalForPrice'),
  };
}

/**
 * @param {any} payload
 * @return {CountablePricePolicy}
 */
function transformCountable(payload) {
  return {
    id: payload.countable_policy_id,
    service: payload.service,
    dataUnit: payload.data_unit,
    dataQuantityForPrice: payload.data_quantity_for_price,
    timeIntervalForPrice: payload.time_interval_for_price,
    pricePlans: sortBy(
      payload.price_plans.map(
        /** @param {any} p */ (p) => ({
          planId: p.plan_id,
          maxQuantity: p.max_quantity,
          price: p.price,
        }),
      ),
      'price',
    ),
  };
}
