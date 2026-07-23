export interface Zone {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  displayName: string;
  lat: number;
  lon: number;
  // transformed: sorted
  outboundIPs: Array<string>;
  // transformed: sorted
  tags: Array<string>;
}
