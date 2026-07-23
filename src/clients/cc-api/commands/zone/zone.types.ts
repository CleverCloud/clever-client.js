/**
 * A geographical region applications and add-ons can be deployed in.
 */
export interface Zone {
  /** Identifier of the zone. */
  id: string;
  /** Short name of the zone, the one used everywhere else in the API, for example `par`. */
  name: string;
  /** Country the zone sits in. */
  country: string;
  /** Two-letter ISO code of that country. */
  countryCode: string;
  /** City the zone sits in. */
  city: string;
  /** Human readable name of the zone, meant to be shown in a picker. */
  displayName: string;
  /** Latitude of the zone, to place it on a map. */
  lat: number;
  /** Longitude of the zone, to place it on a map. */
  lon: number;
  /** Public IP addresses traffic leaving the zone comes from, to be allow-listed downstream. Sorted. */
  outboundIPs: Array<string>;
  /** Labels qualifying the zone, for example whether it is a partner zone. Sorted. */
  tags: Array<string>;
}
