import { ApplicationId } from '../../types/cc-api.types.js';
import type { Application } from './application.types.js';

export interface GetApplicationCommandInput extends ApplicationId {
  withBranches?: boolean;
}

export type GetApplicationCommandOutput = Application;
