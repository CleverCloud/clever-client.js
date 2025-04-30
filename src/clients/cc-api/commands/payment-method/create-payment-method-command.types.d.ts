import { PaymentMethod } from './payment-method.types.js';

export interface CreatePaymentMethodCommandInput {
  ownerId: string;
  id: string;
}

export type CreatePaymentMethodCommandOutput = PaymentMethod;
