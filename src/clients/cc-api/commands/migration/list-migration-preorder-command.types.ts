import type { AddonId } from '../../types/cc-api.types.js';

/**
 * Describes the plan change to simulate. The owner is resolved automatically when omitted.
 */
export interface ListMigrationPreorderCommandInput extends AddonId {
  /** Identifier of the plan the add-on would be migrated to. */
  planId: string;
}

/**
 * The simulated purchase order for the plan change: what the migration would be invoiced, before it is started.
 */
export interface ListMigrationPreorderCommandOutput {
  /** Identifier of the organisation that would be charged. */
  ownerId: string;
  /** Identifier of the resource the order targets. */
  target: string;
  /**
   * When the order was drawn up, which is when the simulation ran.
   * @renamedFrom `emissionDate`
   * @converted to an ISO date string
   */
  emittedAt: string;
  /** Name the order is addressed to. */
  name: string;
  /** Company the order is addressed to. */
  company: string;
  /**
   * VAT number of the organisation the order is addressed to.
   * @renamedFrom `VAT`
   */
  vat: string;
  /** Kind of document this is. A plan change simulation is a purchase order. */
  type: MigrationPreorderType;
  /** What the order is made of. Sorted by total price before tax. */
  lines: Array<MigrationPreorderLine>;
}

/**
 * One line of a simulated purchase order.
 */
export interface MigrationPreorderLine {
  /** What the line bills. Plan changes are always billed as credits. */
  type: 'Credits';
  /** Human readable description of what the line bills. */
  description: string;
  /** How many units the line bills. */
  quantity: number;
  /**
   * VAT rate applied to the line.
   * @renamedFrom `tva`
   */
  vat: number;
  /**
   * Price of one unit, before tax.
   * @renamedFrom `price_unit_ht`
   */
  priceUnitHt: number;
  /**
   * Total price of the line, before tax.
   * @renamedFrom `price_total_ht`
   */
  priceTotalHt: number;
  /** Name of the pack the line belongs to, when it is part of one. */
  pack: null | string;
  /** Number of drops the line represents, drops being the internal consumption unit. */
  dropQuantity: number;
  /** Identifier of the coupon applied to the line, when there is one. */
  coupon: null | number;
  /** Discount applied to the line. Always `0`: the simulated order never carries one. */
  discount: number;
}

/**
 * The kinds of billing document the API can return. A plan change simulation is always a `PURCHASE_ORDER`.
 */
export type MigrationPreorderType = 'INVOICE' | 'CREDITNOTE' | 'PURCHASE_ORDER' | 'ADDON_PREORDER';
