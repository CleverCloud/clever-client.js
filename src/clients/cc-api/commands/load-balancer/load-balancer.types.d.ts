export interface LoadBalancer {
  id: string;
  // renamed from name
  zone: string;
  zoneId: string;
  dns: {
    cname: string;
    a: Array<string>;
  };
}
