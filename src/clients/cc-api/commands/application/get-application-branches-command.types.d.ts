import { ApplicationId } from '../../types/cc-api.types.js';

export interface GetApplicationBranchesCommandInput extends ApplicationId {}

export type GetApplicationBranchesCommandOutput = Array<string>;
