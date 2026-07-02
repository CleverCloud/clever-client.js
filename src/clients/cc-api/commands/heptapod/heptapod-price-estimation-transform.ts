import type { GetHeptapodPriceEstimationCommandOutput } from './get-heptapod-price-estimation-command.types.js';

export function transformHeptapodPriceEstimation(payload: any): GetHeptapodPriceEstimationCommandOutput {
  return {
    publicActiveUsers: payload.public_active_users,
    privateActiveUsers: payload.private_active_users,
    storage: payload.storage,
    price: payload.price,
  };
}
