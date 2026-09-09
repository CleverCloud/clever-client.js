/**
 * The prices in force for a zone and a currency: what a unit of runtime costs, and what each
 * metered resource costs.
 */
export interface PriceSystem {
  /**
   * Identifier of the zone the prices apply to. Absent on a price system covering every zone.
   * @renamedFrom `zone_id`
   */
  zone?: string;
  /** Currency every price below is expressed in. */
  currency: string;
  /**
   * Prices of the runtime scaler sizes, sorted by price.
   * @renamedFrom `runtime`
   */
  runtimes: Array<RuntimePricePolicy>;
  /**
   * Prices of the metered resources, sorted by billed quantity then by billed time interval.
   * @renamedFrom `countable`
   */
  countables: Array<CountablePricePolicy>;
}

/**
 * What one scaler size costs to run for one unit of time.
 */
export interface RuntimePricePolicy {
  /**
   * Identifier of the price policy.
   * @renamedFrom `runtime_policy_id`
   */
  id: string;
  /** System the instance is started by, for example `apps` or `postgresql`. */
  source: string;
  /** Scaler size the price applies to, for example `S` or `S_SML`. */
  flavor: string;
  /**
   * Span of time the price covers, usually one hour, as an ISO-8601 duration (for example `PT1H`).
   * @renamedFrom `time_unit`
   */
  timeUnit: string;
  /** Price of one `timeUnit` of this scaler size. */
  price: number;
  /**
   * Stable price key, usually `<source>.<flavor>`.
   * @renamedFrom `slug_id`
   * @converted lowercased
   */
  priceId: string;
}

/**
 * What one metered resource costs, as a ladder of plans that give a cheaper unit price as usage
 * grows.
 */
export interface CountablePricePolicy {
  /**
   * Identifier of the price policy.
   * @renamedFrom `countable_policy_id`
   */
  id: string;
  /** Service the resource is metered for, for example `cellar` or `fsbucket`. */
  service: string;
  /**
   * Unit the quantity is counted in, for example `BYTES`.
   * @renamedFrom `data_unit`
   */
  dataUnit: string;
  /**
   * Quantity one price covers, and whether it can be billed pro rata.
   * @renamedFrom `data_quantity_for_price`
   */
  dataQuantityForPrice: BillableQuantity;
  /**
   * Span of time one price covers, for resources billed over time rather than per operation. Absent for the resources
   * billed once.
   * @renamedFrom `time_interval_for_price`
   */
  timeIntervalForPrice?: BillableTime;
  /**
   * The ladder of plans, sorted by the quantity they stop applying at, the unlimited plan last.
   * @renamedFrom `price_plans`
   */
  pricePlans: Array<CountablePricePlan>;
}

/**
 * Whether a billed unit can be split: a `secable` unit is billed pro rata, an `insecable` one is
 * billed whole as soon as it is started.
 */
export type Secability = 'secable' | 'insecable';

/**
 * A quantity one price covers.
 */
export interface BillableQuantity {
  /** Whether a partial quantity is billed pro rata or rounded up to the whole quantity. */
  secability: Secability;
  /** How much of the resource one price covers, expressed in the policy's `dataUnit`. */
  quantity: number;
}

/**
 * A span of time one price covers.
 */
export interface BillableTime {
  /** Whether a partial interval is billed pro rata or rounded up to the whole interval. */
  secability: Secability;
  /** Length of the interval, as an ISO-8601 duration. */
  interval: string;
}

/**
 * One rung of a countable price ladder: the unit price applied up to a given cumulated quantity.
 *
 * The plan to apply is the one with the smallest `maxQuantity` still above the measured quantity,
 * falling back to the plan with no limit at all.
 */
export interface CountablePricePlan {
  /**
   * Identifier of the plan.
   * @renamedFrom `plan_id`
   */
  planId: string;
  /**
   * Quantity this plan stops applying at. Absent on the last plan, which has no limit.
   * @renamedFrom `max_quantity`
   */
  maxQuantity?: number;
  /** Price of one billable quantity while this plan applies. */
  price: number;
}
