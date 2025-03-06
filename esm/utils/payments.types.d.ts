export interface Orga {
  id: string;
  name: string;
  cleverEnterprise: boolean;
  isTrusted: boolean;
}

export interface PaymentMethod {
  type: string;
  isDefault: boolean;
  isExpired: boolean;
}

export interface PaymentMethodError {
  type: number;
  orga?: Orga;
}
