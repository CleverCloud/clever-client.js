import type { Zone } from './zone.types.js';

export function transformZone(payload: any): Zone {
  return {
    id: payload.id,
    name: payload.name,
    country: payload.country,
    countryCode: payload.countryCode,
    city: payload.city,
    displayName: payload.displayName ?? undefined,
    lat: payload.lat,
    lon: payload.lon,
    outboundIps: payload.outboundIPs?.sort() ?? [],
    tags: payload?.tags?.sort() ?? [],
  };
}
