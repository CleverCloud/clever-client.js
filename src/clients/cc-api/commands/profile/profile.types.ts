import type { MFAKind } from '../auth/auth.types.js';

export interface Profile {
  id: string;
  // renamed from email
  emailAddress: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  avatar: string;
  // renamed from creationDate
  // transformed: converted to an ISO date string
  createdAt: string;
  lang: string;
  // renamed from emailValidated
  isEmailValidated: boolean;
  // renamed from oauthApps
  // transformed: true when the list holds github
  isLinkedToGitHub: boolean;
  // renamed from admin
  isAdmin: boolean;
  canPay: boolean;
  preferredMFA: MFAKind;
  hasPassword: boolean;
  partnerId: string;
  partnerName: string;
  partnerConsoleUrl: string;
}
