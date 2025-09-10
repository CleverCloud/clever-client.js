import type { Application } from './application.types.js';

export interface ListApplicationCommandInput {
  ownerId: string;
  withBranches: boolean;
}

export type ListApplicationCommandOutput = Array<Application>;
