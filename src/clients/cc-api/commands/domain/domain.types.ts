export interface Domain {
  // renamed from fqdn
  domain: string;
  // transformed: resolved by the command, the payload does not carry it
  isPrimary: boolean;
}
