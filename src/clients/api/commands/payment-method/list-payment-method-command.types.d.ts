import { PaymentMethod } from './payment-method.types.js';

export interface ListPaymentMethodCommandInput {
  ownerId: string;
}

export type ListPaymentMethodCommandOutput = Array<PaymentMethod>;
