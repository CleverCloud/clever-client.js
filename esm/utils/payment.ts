import type { Orga, PaymentMethod, PaymentMethodError } from './payments.types.js';

export const ERROR_TYPES = {
  NO_PAYMENT_METHOD: 1,
  NO_DEFAULT_PAYMENT_METHOD: 2,
  DEFAULT_PAYMENT_METHOD_IS_EXPIRED: 3,
};

export function getOrgaPaymentMethodsError(orga: Orga, paymentMethodList: Array<PaymentMethod>): null | number {
  // Trusted orgas are OK
  if (orga.isTrusted) {
    return null;
  }

  // Premium orgas are OK
  if (orga.cleverEnterprise) {
    return null;
  }

  if (paymentMethodList.length === 0) {
    return ERROR_TYPES.NO_PAYMENT_METHOD;
  }

  const defaultPaymentList = paymentMethodList.filter((pm) => pm.isDefault);
  if (defaultPaymentList.length === 0) {
    return ERROR_TYPES.NO_DEFAULT_PAYMENT_METHOD;
  }

  const defaultPaymentMethod = defaultPaymentList.find((pm) => pm.isDefault);
  if (defaultPaymentMethod!.isExpired) {
    return ERROR_TYPES.DEFAULT_PAYMENT_METHOD_IS_EXPIRED;
  }

  return null;
}

export function getAllOrgaPaymentMethodsErrors(
  personal: { orga: Orga; paymentMethods: Array<PaymentMethod> },
  otherOrgaList: Array<{ orga: Orga; paymentMethods: Array<PaymentMethod> }> = [],
): Array<PaymentMethodError> {
  // If the user only has a personal orga, we display the errors of the personal orga
  if (otherOrgaList.length === 0) {
    const type = getOrgaPaymentMethodsError(personal.orga, personal.paymentMethods);
    return type != null ? [{ type, orga: personal.orga }] : [];
  }

  return otherOrgaList
    .map(({ orga, paymentMethods }) => {
      const type = getOrgaPaymentMethodsError(orga, paymentMethods);
      return type != null ? { type, orga } : null;
    })
    .filter((error) => error != null);
}
