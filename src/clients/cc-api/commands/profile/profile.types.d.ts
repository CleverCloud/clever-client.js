import type { MFAKind } from '../auth/auth.types.js';

export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  avatar: string;
  creationDate: string;
  lang: string;
  emailValidated: boolean;
  isLinkedToGitHub: boolean;
  admin: boolean;
  canPay: boolean;
  preferredMFA: MFAKind;
  hasPassword: boolean;
  partnerId: string;
  partnerName: string;
  partnerConsoleUrl: string;
}
