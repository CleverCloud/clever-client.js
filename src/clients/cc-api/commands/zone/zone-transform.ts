import type { Zone } from './zone.types.js';

export function transformZone(payload: any): Zone {
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
