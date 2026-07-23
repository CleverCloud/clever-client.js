export interface PaymentMethod {
  ownerId: string;
  type: string;
  token: string;
  // renamed from isDefault
  isPrimary: boolean;
  number: string;
}
