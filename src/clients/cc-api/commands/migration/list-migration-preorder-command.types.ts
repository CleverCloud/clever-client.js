import type { AddonId } from '../../types/cc-api.types.js';

export interface ListMigrationPreorderCommandInput extends AddonId {
  planId: string;
}

export interface ListMigrationPreorderCommandOutput {
  ownerId: string;
  target: string;
  // renamed from emissionDate
  // transformed: converted to an ISO date string
  emittedAt: string;
  name: string;
  company: string;
  // renamed from VAT
  vat: string;
  type: MigrationPreorderType;
  // transformed: sorted by priceTotalHt
  lines: Array<MigrationPreorderLine>;
}

export interface MigrationPreorderLine {
  type: 'Credits';
  description: string;
  quantity: number;
  // renamed from tva
  vat: number;
  // renamed from price_unit_ht
  priceUnitHt: number;
  // renamed from price_total_ht
  priceTotalHt: number;
  pack: null | string;
  dropQuantity: number;
  coupon: null | number;
  // transformed: always 0, the payload does not carry it
  discount: number;
}

export type MigrationPreorderType = 'INVOICE' | 'CREDITNOTE' | 'PURCHASE_ORDER' | 'ADDON_PREORDER';
