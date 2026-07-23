import type { PaymentMethod } from './payment-method.types.js';

export function transformPaymentMethod(payload: any): PaymentMethod {
  return {
    ownerId: payload.ownerId,
    type: payload.type,
    token: payload.token,
    isPrimary: payload.isDefault,
    number: payload.number,
  };
}
