/**
 * @import { Organisation, OrganisationMember } from './organisation.types.js'
 */

/**
 *
 * @param {any} response
 * @returns {Organisation}
 */
export function transformOrganisation(response) {
  return {
    id: response.id,
    name: response.name,
    description: response.description,
    // transform billingEmail to billingEmailAddress
    billingEmailAddress: response.billingEmail,
    address: response.address,
    city: response.city,
    zipcode: response.zipcode,
    country: response.country,
    company: response.company,
    VAT: response.VAT,
    avatar: response.avatar,
    vatState: response.vatState,
    customerFullName: response.customerFullName,
    canPay: response.canPay,
    cleverEnterprise: response.cleverEnterprise,
    emergencyNumber: response.emergencyNumber,
    canSEPA: response.canSEPA,
    isTrusted: response.isTrusted,
  };
}

/**
 *
 * @param {any} response
 * @returns {OrganisationMember}
 */
export function transformOrganisationMember(response) {
  return {
    id: response.member.id,
    email: response.member.email,
    name: response.member.name,
    avatar: response.member.avatar,
    preferredMFA: response.member.preferredMFA,
    role: response.role,
    job: response.job,
  };
}
