export interface PulsarInfo {
  id: string;
  url: string;
  // renamed from pulsar_port
  pulsarPort: number;
  // renamed from pulsar_tls_port
  pulsarTlsPort?: number;
  // renamed from web_port
  webPort?: number;
  // renamed from web_tls_port
  webTlsPort?: number;
  version: string;
  available: boolean;
  zone: string;
  // renamed from support_cold_storage
  supportColdStorage: boolean;
  // renamed from supported_plans
  supportedPlans: Array<PulsarPlan>;
}

export type PulsarPlan =
  | 'BETA'
  | 'ORGANISATION_LOGS'
  | 'ORGANISATION_ACCESS_LOGS'
  | 'ORGANISATION_AUDIT_LOGS'
  | 'ORGANISATION_ACTIONS';
