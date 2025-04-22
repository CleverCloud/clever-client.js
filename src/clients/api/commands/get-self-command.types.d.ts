export interface GetSelfCommandOutput {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  avatar: string;
  creationDate: number;
  lang: string;
  emailValidated: boolean;
  oauthApps: Array<string>;
  admin: boolean;
  canPay: boolean;
  preferredMFA: string;
  hasPassword: boolean;
  partnerId: string;
  partnerName: string;
  partnerConsoleUrl: string;
}
