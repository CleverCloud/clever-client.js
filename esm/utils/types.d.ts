interface Orga {
  id: string;
  name: string;
  cleverEnterprise: boolean;
  isTrusted: boolean;
}

interface PaymentMethod {
  type: string;
  isDefault: boolean;
  isExpired: boolean;
}

interface PaymentMethodError {
  type: number;
  orga?: Orga;
}
