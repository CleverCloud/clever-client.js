import { normalizeDate, sortBy } from '../../../../lib/utils.js';
import type {
  GetJenkinsInfoInnerCommandOutput,
  GetJenkinsUpdatesCommandOutput,
} from './get-jenkins-info-command.types.js';

export function transformJenkinsInfo(response: any): GetJenkinsInfoInnerCommandOutput {
  return {
    id: response.id,
    addonId: response.app_id,
    plan: response.plan,
    zone: response.zone,
    createdAt: normalizeDate(response.creation_date)!,
    deletedAt: normalizeDate(response.deletion_date),
    status: response.status,
    host: response.host,
    user: response.user,
    password: response.password,
    version: response.version,
    artifactoryUrl: response.artifactory_url,
    artifactoryUser: response.artifactory_user,
    artifactoryPassword: response.artifactory_password,
    features: sortBy(
      (response.features ?? []).map((feature: any) => ({ name: feature.name, isEnabled: feature.enabled })),
      'name',
    ),
  };
}

export function transformJenkinsUpdates(response: any): GetJenkinsUpdatesCommandOutput {
  return {
    manageLink: response.manageLink,
    versions: {
      current: response.versions.current ?? undefined,
      available: response.versions.available ?? undefined,
    },
  };
}
