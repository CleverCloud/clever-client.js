export interface JenkinsInfo {
  id: string;
  // renamed from app_id
  addonId: string;
  plan: 'OLD_S' | 'OLD_M' | 'OLD_L' | 'OLD_XL' | 'XS' | 'S' | 'M' | 'L' | 'XL';
  zone: string;
  // renamed from creation_date and converted to ISO format (without [UTC])
  creationDate: string;
  status: 'ACTIVE' | 'DELETED' | 'QUOTA_EXCEEDED' | 'TO_DELETE';
  // renamed from deletion_date and converted to ISO format (without [UTC])
  deletionDate?: string;
  host: string;
  user: string;
  password: string;
  version: string;
  // renamed from artifactory_url
  artifactoryUrl?: string;
  // renamed from artifactory_user
  artifactoryUser?: string;
  // renamed from artifactory_password
  artifactoryPassword?: string;
  features: Array<{ name: string; enabled: boolean }>;
  updates: JenkinsUpdates;
}

export interface JenkinsUpdates {
  manageLink: string;
  versions: {
    current: string;
    available: string;
  };
}
