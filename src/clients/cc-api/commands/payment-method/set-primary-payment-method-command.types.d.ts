import { PaymentMethod } from './payment-method.types.js';

export interface SetPrimaryPaymentMethodCommandInput {
  ownerId: string;
  id: string;
}

export type SetPrimaryPaymentMethodCommandOutput = PaymentMethod;
