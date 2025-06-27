import { AddonId } from '../../types/cc-api.types.js';

export interface ListMigrationPreorderCommandInput extends AddonId {
  planId: string;
}

export interface ListMigrationPreorderCommandOutput {
  ownerId: string;
  target: string;
  emissionDate: string;
  name: string;
  company: string;
  VAT: string;
  type: MigrationPreorderType;
  lines: Array<MigrationPreorderLine>;
}

export interface MigrationPreorderLine {
  type: 'Credits';
  description: string;
  quantity: number;
  tva: number;
  // renamed from price_unit_ht
  priceUnitHt: number;
  // renamed from price_total_ht
  priceTotalHt: number;
  pack: null | string;
  dropQuantity: number;
  coupon: null | number;
  discount: number;
}

export type MigrationPreorderType = 'INVOICE' | 'CREDITNOTE' | 'PURCHASE_ORDER' | 'ADDON_PREORDER';
