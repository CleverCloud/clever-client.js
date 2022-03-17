/**
 * @typedef {import('./types.js').Orga} Orga
 * @typedef {import('./types.js').PaymentMethod} PaymentMethod
 * @typedef {import('./types.js').PaymentMethodError} PaymentMethodError
 */

export const ERROR_TYPES = {
  NO_PAYMENT_METHOD: 1,
  NO_DEFAULT_PAYMENT_METHOD: 2,
  DEFAULT_PAYMENT_METHOD_IS_EXPIRED: 3,
};

/**
 * @param {Orga} orga
 * @param {Array<PaymentMethod>} paymentMethodList
 * @return {null|number}
 */
export function getOrgaPaymentMethodsError (orga, paymentMethodList) {

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

  const defaultPaymentMethod = defaultPaymentList.find((pm) => pm.isDefault === true);
  if (defaultPaymentMethod.isExpired) {
    return ERROR_TYPES.DEFAULT_PAYMENT_METHOD_IS_EXPIRED;
  }

  return null;
}

/**
 * @param {{ orga: Orga, paymentMethods: Array<PaymentMethod> }} personal
 * @param {Array<{ orga: Orga, paymentMethods: Array<PaymentMethod> }>} otherOrgaList
 * @return {Array<PaymentMethodError>}
 */
export function getAllOrgaPaymentMethodsErrors (personal, otherOrgaList = []) {

  // If the user only has a personal orga, we display the errors of the personal orga
  if (otherOrgaList.length === 0) {
    const type = getOrgaPaymentMethodsError(personal.orga, personal.paymentMethods);
    return (type != null)
      ? [{ type, orga: personal.orga }]
      : [];
  }

  return otherOrgaList
    .map(({ orga, paymentMethods }) => {
      const type = getOrgaPaymentMethodsError(orga, paymentMethods);
      return (type != null)
        ? { type, orga }
        : null;
    })
    .filter((error) => error != null);
}
