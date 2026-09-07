import { normalizeDate } from '../../../../lib/utils.js';
import type { Profile } from './profile.types.js';

export function transformProfile(payload: any): Profile {
  return {
    id: payload.id,
    emailAddress: payload.email,
    name: payload.name ?? undefined,
    phone: payload.phone ?? undefined,
    address: payload.address ?? undefined,
    city: payload.city ?? undefined,
    zipcode: payload.zipcode ?? undefined,
    country: payload.country ?? undefined,
    avatar: payload.avatar ?? undefined,
    createdAt: normalizeDate(payload.creationDate)!,
    language: payload.lang ?? undefined,
    isEmailValidated: payload.emailValidated,
    isLinkedToGitHub: payload.oauthApps != null && payload.oauthApps.includes('github'),
    isAdmin: payload.admin,
    canPay: payload.canPay,
    preferredMfa: payload.preferredMFA,
    hasPassword: payload.hasPassword,
    partnerId: payload.partnerId,
    partnerName: payload.partnerName,
    partnerConsoleUrl: payload.partnerConsoleUrl,
    contextFlags: payload.contextFlags ?? [],
  };
}
