import { normalizeDate } from '../../../../lib/utils.js';
import type { Profile } from './profile.types.js';

export function transformProfile(payload: any): Profile {
  return {
    id: payload.id,
    emailAddress: payload.email,
    name: payload.name,
    phone: payload.phone,
    address: payload.address,
    city: payload.city,
    zipcode: payload.zipcode,
    country: payload.country,
    avatar: payload.avatar,
    createdAt: normalizeDate(payload.creationDate)!,
    lang: payload.lang,
    isEmailValidated: payload.emailValidated,
    isLinkedToGitHub: payload.oauthApps != null && payload.oauthApps.includes('github'),
    isAdmin: payload.admin,
    canPay: payload.canPay,
    preferredMFA: payload.preferredMFA,
    hasPassword: payload.hasPassword,
    partnerId: payload.partnerId,
    partnerName: payload.partnerName,
    partnerConsoleUrl: payload.partnerConsoleUrl,
  };
}
