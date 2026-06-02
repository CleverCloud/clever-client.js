export interface Zone {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  displayName: string;
  lat: number;
  lon: number;
  outboundIPs: Array<string>;
  tags: Array<string>;
}
