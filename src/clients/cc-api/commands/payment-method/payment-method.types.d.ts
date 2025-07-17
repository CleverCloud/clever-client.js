export interface PaymentMethod {
  ownerId: string;
  type: string;
  token: string;
  // renamed from isDefault
  primary: boolean;
  number: string;
}
