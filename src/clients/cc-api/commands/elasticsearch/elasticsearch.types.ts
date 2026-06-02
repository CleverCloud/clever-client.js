export interface ElasticsearchInfo {
  id: string;
  // renamed from owner_id
  ownerId: string;
  version: string;
  // renamed from app_id
  addonId: string;
  plan: string;
  zone: string;
  config: {
    host: string;
    user: string;
    password: string;
    // renamed from apm_user
    apmUser: string;
    // renamed from apm_password
    apmPassword: string;
    // renamed from apm_auth_token
    apmAuthToken: string;
    // renamed from kibana_user
    kibanaUser: string;
    // renamed from kibana_password
    kibanaPassword: string;
  };
  backups: {
    // renamed from kibana_snapshots_url
    kibanaSnapshotsUrl: string;
  };
  // renamed from kibana_application
  kibanaApplication: string;
  // renamed from apm_application
  apmApplication: string;
  services: Array<{ name: string; enabled: boolean }>;
  features: Array<{ name: string; enabled: boolean }>;
}
