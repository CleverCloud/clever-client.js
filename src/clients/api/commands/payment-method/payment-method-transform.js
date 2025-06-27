/**
 * @import { PaymentMethod } from './payment-method.types.js'
 */

/**
 *
 * @param {any} response
 * @return {PaymentMethod}
 */
export function transformPaymentMethod(response) {
  return {
    ownerId: response.ownerId,
    type: response.type,
    token: response.token,
    primary: response.isDefault,
    number: response.number,
  };
}
