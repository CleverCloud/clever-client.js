/** @import { Zone } from './zone.types.d.ts' */

/**
 * @param {any} payload
 * @returns {Zone}
 */
export function transformZone(payload) {
  return {
    id: payload.id,
    name: payload.name,
    country: payload.country,
    countryCode: payload.countryCode,
    city: payload.city,
    displayName: payload.displayName,
    lat: payload.lat,
    lon: payload.lon,
    outboundIPs: payload.outboundIPs?.sort() ?? [],
    tags: payload?.tags.sort() ?? [],
  };
}
