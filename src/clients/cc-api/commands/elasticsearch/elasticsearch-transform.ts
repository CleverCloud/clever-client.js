import { sortBy } from '../../../../lib/utils.js';
import type { ElasticsearchInfo } from './elasticsearch.types.js';

export function transformElasticsearchInfo(response: any): ElasticsearchInfo {
  return {
    id: response.id,
    ownerId: response.owner_id ?? null,
    addonId: response.app_id,
    plan: response.plan,
    zone: response.zone,
    config: {
      host: response.config.host,
      user: response.config.user,
      password: response.config.password,
      apmUser: response.config.apm_user,
      apmPassword: response.config.apm_password,
      apmAuthToken: response.config.apm_auth_token,
      kibanaUser: response.config.kibana_user,
      kibanaPassword: response.config.kibana_password,
    },
    version: response.version,
    backups: {
      kibanaSnapshotsUrl: response.backups.kibana_snapshots_url ?? null,
    },
    kibanaApplication: response.kibana_application ?? null,
    apmApplication: response.apm_application ?? null,
    services: transformNamedFlags(response.services),
    features: transformNamedFlags(response.features),
  };
}

function transformNamedFlags(payload: Array<any>): Array<{ name: string; isEnabled: boolean }> {
  return sortBy(
    payload.map((item: any) => ({ name: item.name, isEnabled: item.enabled })),
    'name',
  );
}
