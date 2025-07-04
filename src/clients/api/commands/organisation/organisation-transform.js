/**
 * @import { Organisation, OrganisationMember } from './organisation.types.js'
 */

/**
 *
 * @param {any} payload
 * @returns {Organisation}
 */
export function transformOrganisation(payload) {
  return {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    // transform billingEmail to billingEmailAddress
    billingEmailAddress: payload.billingEmail,
    address: payload.address,
    city: payload.city,
    zipcode: payload.zipcode,
    country: payload.country,
    company: payload.company,
    VAT: payload.VAT,
    avatar: payload.avatar,
    vatState: payload.vatState,
    customerFullName: payload.customerFullName,
    canPay: payload.canPay,
    cleverEnterprise: payload.cleverEnterprise,
    emergencyNumber: payload.emergencyNumber,
    canSEPA: payload.canSEPA,
    isTrusted: payload.isTrusted,
  };
}

/**
 *
 * @param {any} payload
 * @returns {OrganisationMember}
 */
export function transformOrganisationMember(payload) {
  return {
    id: payload.member.id,
    email: payload.member.email,
    name: payload.member.name,
    avatar: payload.member.avatar,
    preferredMFA: payload.member.preferredMFA,
    role: payload.role,
    job: payload.job,
  };
}
