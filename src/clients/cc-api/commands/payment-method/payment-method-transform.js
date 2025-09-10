/**
 * @import { PaymentMethod } from './payment-method.types.js'
 */

/**
 *
 * @param {any} payload
 * @returns {PaymentMethod}
 */
export function transformPaymentMethod(payload) {
  return {
    ownerId: payload.ownerId,
    type: payload.type,
    token: payload.token,
    primary: payload.isDefault,
    number: payload.number,
  };
}
