/**
 * @import { Profile } from './profile.types.js'
 */

import { normalizeDate } from '../../../../lib/utils.js';

/**
 * @param {any} payload
 * @returns {Profile}
 */
export function transformProfile(payload) {
  return {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    phone: payload.phone,
    address: payload.address,
    city: payload.city,
    zipcode: payload.zipcode,
    country: payload.country,
    avatar: payload.avatar,
    creationDate: normalizeDate(payload.creationDate),
    lang: payload.lang,
    emailValidated: payload.emailValidated,
    isLinkedToGitHub: payload.oauthApps != null && payload.oauthApps.includes('github'),
    admin: payload.admin,
    canPay: payload.canPay,
    preferredMFA: payload.preferredMFA,
    hasPassword: payload.hasPassword,
    partnerId: payload.partnerId,
    partnerName: payload.partnerName,
    partnerConsoleUrl: payload.partnerConsoleUrl,
  };
}
