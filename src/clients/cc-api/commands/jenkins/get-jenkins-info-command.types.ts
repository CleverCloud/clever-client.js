import type { JenkinsInfo, JenkinsUpdates } from './jenkins.types.js';

export interface GetJenkinsInfoCommandInput {
  addonId: string;
}

export type GetJenkinsInfoCommandOutput = JenkinsInfo | undefined;

export type GetJenkinsInfoInnerCommandOutput = Omit<JenkinsInfo, 'updates'>;

export type GetJenkinsUpdatesCommandOutput = JenkinsUpdates;
