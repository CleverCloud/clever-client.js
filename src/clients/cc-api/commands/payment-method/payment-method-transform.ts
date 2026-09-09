import { normalizeDate } from '../../../../lib/utils.js';
import type { PaymentMethod } from './payment-method.types.js';

export function transformPaymentMethod(payload: any): PaymentMethod {
  const common = {
    ownerId: payload.ownerId,
    token: payload.token,
    isPrimary: payload.isDefault,
    number: payload.number,
  };

  if (payload.type === 'SEPA_DEBIT') {
    return {
      ...common,
      type: 'SEPA_DEBIT',
      bankCode: payload.bankCode ?? undefined,
      branchCode: payload.branchCode ?? undefined,
      country: payload.country,
      fingerprint: payload.fingerprint,
    };
  }

  return {
    ...common,
    type: 'CREDITCARD',
    holderName: payload.holderName ?? undefined,
    expiresAt: normalizeDate(payload.expirationDate)!,
    isExpired: payload.isExpired,
    cardType: payload.cardType,
    availableNetworks: payload.availableNetworks ?? [],
    preferredNetwork: payload.preferredNetwork ?? undefined,
  };
}
