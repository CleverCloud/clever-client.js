/**
 * @import { PriceSystem } from './price-system.types.js'
 */

/**
 * @param {any} response
 * @returns {PriceSystem}
 */
export function transformPriceSystem(response) {
  return {
    zoneId: response.zone_id,
    currency: response.currency,
    runtime: response.runtime.map(
      /** @param {any} r */ (r) => ({
        id: r.runtime_policy_id,
        source: r.source,
        flavor: r.flavor,
        timeUnit: r.time_unit,
        price: r.price,
        priceId: r.slug_id.toLowerCase(),
      }),
    ),
    countable: response.countable.map(
      /** @param {any} c */ (c) => ({
        id: c.countable_policy_id,
        service: c.service,
        dataUnit: c.data_unit,
        dataQuantityForPrice: c.data_quantity_for_price,
        timeIntervalForPrice: c.time_interval_for_price,
        pricePlans: c.price_plans.map(
          /** @param {any} p */ (p) => ({
            planId: p.plan_id,
            maxQuantity: p.max_quantity,
            price: p.price,
          }),
        ),
      }),
    ),
  };
}
