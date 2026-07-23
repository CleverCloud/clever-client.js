import type { JenkinsInfo, JenkinsUpdates } from './jenkins.types.js';

/**
 * Identifies the Jenkins add-on to read.
 */
export interface GetJenkinsInfoCommandInput {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
}

/**
 * The Jenkins instance, with its update state merged in.
 */
export type GetJenkinsInfoCommandOutput = JenkinsInfo;

/**
 * The Jenkins instance, before its update state is merged in.
 *
 * @internal
 */
export type GetJenkinsInfoInnerCommandOutput = Omit<JenkinsInfo, 'updates'>;

/**
 * The update state of a Jenkins instance.
 *
 * @internal
 */
export type GetJenkinsUpdatesCommandOutput = JenkinsUpdates;
