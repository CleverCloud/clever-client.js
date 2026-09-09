/**
 * A Jenkins add-on: the managed continuous integration server, with the credentials to reach it and
 * the state of its update.
 */
export interface JenkinsInfo {
  /** Provider-side identifier of the Jenkins instance. */
  id: string;
  /**
   * Identifier of the add-on the instance belongs to.
   * @renamedFrom `app_id`
   */
  addonId: string;
  /** Plan the instance runs on. The `OLD_*` plans are grandfathered and no longer offered. */
  plan: 'OLD_S' | 'OLD_M' | 'OLD_L' | 'OLD_XL' | 'XS' | 'S' | 'M' | 'L' | 'XL';
  /** Name of the zone the instance runs in. */
  zone: string;
  /**
   * When the instance was provisioned.
   * @renamedFrom `creation_date`
   * @converted to an ISO date string without the trailing `[UTC]`
   */
  createdAt: string;
  /** Where the instance stands: running, scheduled for deletion, already gone, or held back by a quota. */
  status: 'ACTIVE' | 'DELETED' | 'QUOTA_EXCEEDED' | 'TO_DELETE';
  /**
   * When the instance was deleted, when it was.
   * @renamedFrom `deletion_date`
   * @converted to an ISO date string without the trailing `[UTC]`
   */
  deletedAt?: string;
  /** Host the Jenkins web interface answers on. */
  host: string;
  /** User name to sign into Jenkins with. */
  user: string;
  /** Password to sign into Jenkins with. */
  password: string;
  /** Jenkins version currently installed. */
  version: string;
  /**
   * URL of the Artifactory repository wired to this instance.
   * @renamedFrom `artifactory_url`
   */
  artifactoryUrl?: string;
  /**
   * User name to reach Artifactory with.
   * @renamedFrom `artifactory_user`
   */
  artifactoryUser?: string;
  /**
   * Password to reach Artifactory with.
   * @renamedFrom `artifactory_password`
   */
  artifactoryPassword?: string;
  /**
   * Optional capabilities turned on for this instance, sorted by name.
   * Each entry's `enabled` is renamed to `isEnabled`.
   */
  features: Array<{
    /** Name of the feature. */
    name: string;
    /** Whether the feature is turned on. */
    isEnabled: boolean;
  }>;
  /** Where the instance stands with respect to the latest Jenkins release. */
  updates: JenkinsUpdates;
}

/**
 * Whether a newer Jenkins is available for an instance, and where to trigger the update.
 */
export interface JenkinsUpdates {
  /** URL of the Jenkins page the update is triggered from. */
  manageLink: string;
  /** The versions being compared. */
  versions: {
    /** Version currently installed. Absent when the add-on has no recorded version. */
    current?: string;
    /** Latest version that can be installed. Absent when the add-on has no recorded version. */
    available?: string;
  };
}
