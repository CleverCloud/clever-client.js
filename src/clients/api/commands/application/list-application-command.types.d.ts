import type { Application } from './application.types.js';

export interface ListApplicationCommandInput {
  ownerId: string;
}

export type ListApplicationCommandOutput = Array<Application>;
