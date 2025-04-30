export interface GetHeptapodPriceEstimationCommandInput {
  ownerId: string;
}

export interface GetHeptapodPriceEstimationCommandOutput {
  // renamed from public_active_users
  publicActiveUsers: number;
  // renamed from private_active_users
  privateActiveUsers: number;
  storage: number;
  price: number;
}
